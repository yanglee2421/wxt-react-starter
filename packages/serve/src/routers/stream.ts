import { Router } from "express";
import timers from "node:timers";

export const routerStream = Router();

routerStream.get("/stream", async (req, res) => {
  void req;

  res.setHeader("Content-type", "application/octet-stream");

  const text = "为什么电脑永远不会生病？因为它有Windows（窗户）可以通风。";
  for (const chunk of text) {
    await timers.promises.setTimeout(1000);
    res.write(chunk);
  }

  return res.end();
});
