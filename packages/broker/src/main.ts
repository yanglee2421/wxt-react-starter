import { defaultDbUrl, relations, schema } from "@yanglee2421/db";
import { Aedes } from "aedes";
import createRedisPersistence from "aedes-persistence-redis";
import { Worker } from "bullmq";
import { drizzle } from "drizzle-orm/node-sqlite";
import { Redis } from "ioredis";
import createRedisMq from "mqemitter-redis";
import { createServer } from "node:net";
import { DatabaseSync } from "node:sqlite";

const main = async () => {
  const port = 1883;
  const BULLMQ_WORKER_NAME = "mqtt_message_queue";

  const redis = new Redis({
    retryStrategy: (times) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: null,
  });
  const broker = await Aedes.createBroker({
    mq: createRedisMq(),
    persistence: createRedisPersistence(),
  });
  const server = createServer(broker.handle);
  const client = new DatabaseSync(defaultDbUrl);
  const db = drizzle({ client, schema, relations });
  const worker = new Worker(
    BULLMQ_WORKER_NAME,
    async (job) => {
      const { topic, payload } = job.data;
      console.log(`Processing message from topic ${topic}: ${payload}`);

      await new Promise<void>((resolve, reject) => {
        broker.publish(
          {
            cmd: "publish",
            /**
             * QoS 0: 最多一次传输，消息可能丢失或重复。
             * QoS 1: 至少一次传输，确保消息至少到达一次，但可能会重复。
             * QoS 2: 只有一次传输，确保消息仅到达一次，适用于重要消息。
             */
            qos: 0,
            dup: false,
            retain: false,
            topic,
            payload: Buffer.from(payload),
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          },
        );
      });
    },
    {
      // @ts-ignore
      connection: redis,
      removeOnComplete: {
        count: 100,
      },
      removeOnFail: {
        count: 100,
      },
    },
  );

  redis.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  broker.authenticate = (client, username, password, callback) => {
    const isValidUserName = username === "admin";
    const isValidPassword = password?.toString() === "123456";
    const authorized = isValidUserName && isValidPassword;

    if (authorized) {
      Reflect.set(client, "user", username);
    }

    callback(null, authorized);
  };

  broker.authorizePublish = (_client, packet, callback) => {
    if (packet.topic.startsWith("public/")) {
      callback(null);
    } else {
      callback(new Error("无权发布到此主题"));
    }
  };

  broker.on("client", (client) => {
    console.log(`[连接] 客户端ID: ${client.id}`);
  });

  broker.on("clientDisconnect", (client) => {
    console.log(`[断开] 客户端ID: ${client.id}`);
  });

  broker.on("publish", (packet, client) => {
    if (!client) return;

    console.log(`[消息] 来自 ${client.id} 的主题 ${packet.topic}: ${packet.payload.toString()}`);

    db.insert(schema.sessions).values({
      userId: 1,
    });
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err);
  });

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully.`);
  });

  server.listen(port, () => {
    console.log("Aedes MQTT broker started and listening on port ", port);
  });
};

main().catch((err) => {
  console.error("Error starting MQTT broker:", err);
});
