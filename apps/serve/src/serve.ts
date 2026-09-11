import { container } from "@/features";
import { serve } from "@hono/node-server";
import { schema } from "@yanglee2421/db";
import { logger } from "hono/logger";
import { factory } from "./infra/app-factory";

export const serveApp = () => {
  const app = factory.createApp();

  app.use(logger());
  app.get("/", async (c) => {
    const db = container.cradle.db.client;
    const rows = await db.select().from(schema.users);

    return c.json({ rows });
  });

  return serve({ ...app, port: 8080, hostname: "localhost" }, (info) => {
    console.log(info);
  });
};

serveApp();
