import { Aedes } from "aedes";
import { createServer } from "node:http";
import { WebSocketServer, createWebSocketStream } from "ws";

export const main = async () => {
  const port = 1883;
  const aedes = await Aedes.createBroker();
  const httpServer = createServer();
  const wss = new WebSocketServer({ server: httpServer });

  aedes.authenticate = (client, username, password, callback) => {
    const isValidUserName = username === "admin";
    const isValidPassword = password?.toString() === "123456";
    const authorized = isValidUserName && isValidPassword;

    if (authorized) {
      Reflect.set(client, "user", username);
    }

    callback(null, authorized);
  };

  aedes.authorizePublish = (_client, packet, callback) => {
    if (packet.topic.startsWith("public/")) {
      callback(null);
    } else {
      callback(new Error("无权发布到此主题"));
    }
  };

  aedes.on("client", (client) => {
    console.log(`[连接] 客户端ID: ${client.id}`);
  });

  aedes.on("clientDisconnect", (client) => {
    console.log(`[断开] 客户端ID: ${client.id}`);
  });

  aedes.on("publish", (packet, client) => {
    if (!client) return;

    console.log(`[消息] 来自 ${client.id} 的主题 ${packet.topic}: ${packet.payload.toString()}`);
  });

  wss.on("connection", (websocket, req) => {
    const stream = createWebSocketStream(websocket);
    aedes.handle(stream, req);
  });

  httpServer.listen(port, () => {
    console.log("Aedes MQTT broker started and listening on port ", port);
  });
};
