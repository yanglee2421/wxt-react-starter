import { axiosBing } from "@/api/bing/axiosBing";
import { Router } from "express";

export const bingRouter = Router();

bingRouter.get("/", async (_, res) => {
  const result = await axiosBing.get("http://localhost:3000/api/auth/me");

  return res.json(result.data);
});
