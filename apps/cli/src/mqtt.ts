import mqtt from "mqtt";

class Demo {
  mqttClient: mqtt.MqttClient | null = null;
  manualDisconnect: boolean = false;
  reconnectNotified: boolean = false;
  reconnectAttempts = 0;

  connectWebsocket() {
    if (this.mqttClient) {
      this.disconnectWebsocket();
    }
    this.manualDisconnect = false;
    this.reconnectNotified = false;
    this.reconnectAttempts = 0;

    const clientId = `location1-info-${Date.now()}`;
    const client = mqtt.connect("ws://ruihuizg.cn:8083/mqtt", {
      clientId,
      connectTimeout: 5000,
      keepalive: 5,
      reconnectPeriod: 3000,
      clean: true,
    });
    this.mqttClient = client;

    client.on("connect", () => {
      this.wsConnected = true;
      this.socketError = false;
      this.reconnectNotified = false;
      this.reconnectAttempts = 0;
      console.log("[MQTT] 连接成功");
      this.$message.success("MQTT 连接成功");

      client.subscribe("device/up", (err) => {
        if (err) {
          console.error("[MQTT] 订阅 device/up 失败", err);
          this.$message.error("订阅 device/up 失败");
          return;
        }
        console.log("[MQTT] 已订阅主题 device/up");
        this.$message.success("已订阅主题 device/up");
      });
    });

    client.on("reconnect", () => {
      this.wsConnected = false;
      this.reconnectAttempts++;
      if (!this.reconnectNotified) {
        this.reconnectNotified = true;
        this.$message.warning("连接已断开，正在自动重连");
      }
      console.log(`[MQTT] 正在重连... 第 ${this.reconnectAttempts} 次`);
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn(`[MQTT] 已达最大重连次数 ${this.maxReconnectAttempts}，停止重连`);
        this.$message.error(`MQTT 重连失败，已达最大重试次数`);
        this.disconnectWebsocket();
      }
    });

    client.on("message", (topic, payload) => {
      const payloadText = payload ? payload.toString() : "";
      console.log(`[MQTT] 收到消息 [${topic}]:`, payloadText);

      let parsedData = null;
      try {
        parsedData = payloadText ? JSON.parse(payloadText) : null;
      } catch (error) {
        console.warn("[MQTT] 消息解析失败:", error);
        return;
      }

      if (!parsedData) {
        console.warn("[MQTT] 消息内容为空");
        return;
      }

      if (!parsedData.longitude || !parsedData.latitude) {
        console.warn("[MQTT] 消息缺少经纬度数据:", parsedData);
        return;
      }

      try {
        const lng = this.convertDmToDecimal(parsedData.longitude);
        const lat = this.convertDmToDecimal(parsedData.latitude);

        if (lng === null || lat === null) {
          console.warn("[MQTT] 经纬度转换失败");
          return;
        }

        console.log(`[MQTT] 设备 ${parsedData.deviceId} 坐标: ${lng}, ${lat}`);

        this.updateDevicePoint(parsedData.deviceId, lng, lat, parsedData);
        // 实时检测围栏（非初始化，会触发报警）
        this.checkPointInFence(parsedData.deviceId, lng, lat, false);
      } catch (error) {
        console.error("[MQTT] 处理消息时出错:", error);
      }
    });

    client.on("error", (err) => {
      this.wsConnected = false;
      this.socketError = true;
      console.error("[MQTT] 连接错误:", err);
      if (!this.manualDisconnect) {
        this.$message.error("MQTT 连接失败");
      }
    });

    client.on("close", () => {
      this.wsConnected = false;
      console.log("[MQTT] 连接已关闭");
    });

    client.on("offline", () => {
      this.wsConnected = false;
      console.log("[MQTT] 客户端离线");
    });
  }

  convertDmToDecimal(val) {
    if (val === null || val === undefined || val === "") return null;
    const num = Number(val);
    if (isNaN(num)) return null;
    if (Math.abs(num) <= 180) {
      return Number(num.toFixed(8));
    }
    const degree = Math.floor(num / 100);
    const minute = num % 100;
    const decimal = degree + minute / 60;
    return Number(decimal.toFixed(8));
  }

  disconnectWebsocket() {
    this.manualDisconnect = true;
    if (this.mqttClient) {
      try {
        this.mqttClient.removeAllListeners();
        this.mqttClient.end(true);
        console.log("[MQTT] 连接已断开");
      } catch (e) {
        console.warn("[MQTT] 断开连接异常", e);
      }
      this.mqttClient = null;
    }
    this.wsConnected = false;
    this.socketError = false;
  }

  startDeviceCheckTimer() {
    if (this.deviceCheckTimer) {
      clearInterval(this.deviceCheckTimer);
    }
    this.deviceCheckTimer = setInterval(() => {
      this.checkDeviceTimeout();
    }, 2000);
  }

  checkDeviceTimeout() {
    const now = Date.now();
    const timeoutDevices = [];

    Object.keys(this.deviceEntities).forEach((deviceId) => {
      const device = this.deviceEntities[deviceId];
      if (now - device.lastUpdate > this.deviceTimeout) {
        timeoutDevices.push(deviceId);
      }
    });

    timeoutDevices.forEach((deviceId) => {
      this.removeDevicePoint(deviceId);
    });
  }

  removeDevicePoint(deviceId) {
    if (!this.viewer) return;

    const device = this.deviceEntities[deviceId];
    if (device && device.entity) {
      this.viewer.entities.remove(device.entity);
      delete this.deviceEntities[deviceId];
      console.log(`[MQTT] 移除超时设备 ${deviceId}`);
    }
  }

  updateDevicePoint(deviceId, lng, lat, data) {
    if (!this.viewer) {
      console.warn("[MQTT] Viewer 未初始化");
      return;
    }

    const Cesium = this.getCesium();
    if (!Cesium) return;

    const now = Date.now();

    if (this.deviceEntities[deviceId]) {
      const device = this.deviceEntities[deviceId];
      device.entity.position = Cesium.Cartesian3.fromDegrees(lng, lat);
      device.lastUpdate = now;
      device.lng = lng;
      device.lat = lat;
      console.log(`[MQTT] 更新设备 ${deviceId} 位置`);
    } else {
      const color = this.deviceColors[this.deviceColorIndex % this.deviceColors.length];
      this.deviceColorIndex++;

      const entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lng, lat),
        point: {
          pixelSize: 12,
          color: Cesium.Color.fromCssColorString(color),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: deviceId || "未知设备",
          font: "14px sans-serif",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -20),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });

      this.deviceEntities[deviceId] = {
        entity: entity,
        color: color,
        lastUpdate: now,
        lng: lng,
        lat: lat,
      };
      console.log(`[MQTT] 添加新设备 ${deviceId}，颜色: ${color}`);
    }

    if (this.isRecording) {
      this.recordTrackPoint(deviceId, lng, lat);
    }
  }
}
