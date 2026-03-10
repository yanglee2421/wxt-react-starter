import { type AxiosInstance } from "axios";
import { Router } from "express";
import { Redis } from "ioredis";

export const createBingRouter = (axiosBing: AxiosInstance) => {
  const bingRouter = Router();

  bingRouter.get("/", async (_, res) => {
    const result = await axiosBing.get("http://localhost:3000/api/auth/me");

    return res.json(result.data);
  });

  bingRouter.get("/search", async (_, res) => {
    const redis = new Redis();
    const result = await redis.lpush("mqtt_messages", "bing search: ");
    await redis.quit();

    return res.json({ message: "bing search", result });
  });

  return bingRouter;
};
