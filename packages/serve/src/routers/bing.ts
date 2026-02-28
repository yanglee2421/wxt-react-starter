import { Router } from "express";
import type { AxiosInstance } from "axios";

export const createBingRouter = (axiosBing: AxiosInstance) => {
  const bingRouter = Router();

  bingRouter.get("/", async (_, res) => {
    const result = await axiosBing.get("http://localhost:3000/api/auth/me");

    return res.json(result.data);
  });

  return bingRouter;
};
