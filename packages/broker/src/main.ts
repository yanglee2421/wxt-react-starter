import { createDatabase, schema, type DB } from "@yanglee2421/db";
import { Aedes } from "aedes";
import createRedisPersistence from "aedes-persistence-redis";
import { Redis } from "ioredis";
import createRedisMq from "mqemitter-redis";
import { createServer } from "node:net";

class MessageListener {
  #isRunning = false;
  #redis: Redis;
  #db: DB;

  constructor(redis: Redis, db: DB) {
    this.#redis = redis;
    this.#db = db;
  }

  async start() {
    if (this.#isRunning) return;

    this.#isRunning = true;

    while (this.#isRunning) {
      const data = await this.#redis.brpop("mqtt_messages", 0);
      console.log("redis brpop", data);
      try {
        const result = await this.#db.select().from(schema.users);
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    }
  }
  stop() {
    this.#isRunning = false;
  }
}

const main = async () => {
  const port = 1883;
  const db = createDatabase();
  const redis = new Redis({
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });
  const messageListener = new MessageListener(redis, db);
  const broker = await Aedes.createBroker({
    mq: createRedisMq(),
    persistence: createRedisPersistence(),
  });
  const server = createServer(broker.handle);

  redis.on("error", (err) => {
    console.error("Redis Client Error", err);
  });
  redis.on("end", () => {
    messageListener.stop();
  });
  redis.on("close", () => {
    messageListener.stop();
  });
  redis.on("ready", async () => {
    messageListener.start();
  });

  const result = await redis.get("mqtt_broker_status");
  console.log("MQTT Broker Status:", result);

  // 2. 身份认证与权限控制
  broker.authenticate = (client, username, password, callback) => {
    const authorized =
      username === "admin" && password?.toString() === "123456";

    if (authorized) {
      // 将用户信息绑定到 client 实例
      // client.user = username;
      Reflect.set(client, "user", username);
    }

    // 第一个参数是错误对象，第二个是布尔值确认是否允许连接
    callback(null, authorized);
  };

  // 3. 鉴权：限制客户端只能发布/订阅特定主题
  broker.authorizePublish = (_client, packet, callback) => {
    if (packet.topic.startsWith("public/")) {
      return callback(null);
    }
    callback(new Error("无权发布到此主题"));
  };

  // 4. 事件监听（用于日志监控）
  broker.on("client", (client) => {
    console.log(`[连接] 客户端ID: ${client.id}`);
  });

  broker.on("clientDisconnect", (client) => {
    console.log(`[断开] 客户端ID: ${client.id}`);
  });

  broker.on("publish", (packet, client) => {
    if (client) {
      console.log(
        `[消息] 来自 ${client.id} 的主题 ${packet.topic}: ${packet.payload.toString()}`,
      );
    }
  });

  server.listen(port, function () {
    console.log("Aedes MQTT broker started and listening on port ", port);
  });

  messageListener.start();
};

main().catch((err) => {
  console.error("Error starting MQTT broker:", err);
});
