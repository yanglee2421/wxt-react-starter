import { container } from "@/features";
import { serve } from "@hono/node-server";
import { schema } from "@yanglee2421/db";
import { logger } from "hono/logger";
import { fromEventPattern, merge, tap } from "rxjs";
import { factory } from "./infra/app-factory";

const exit$ = fromEventPattern(
  (f) => process.on("exit", f),
  (f) => process.off("exit", f),
);
const sigint$ = fromEventPattern(
  (f) => process.on("SIGINT", f),
  (f) => process.off("SIGINT", f),
).pipe(
  tap(() => {
    process.exit();
  }),
);
const sigterm$ = fromEventPattern(
  (f) => process.on("SIGTERM", f),
  (f) => process.off("SIGTERM", f),
).pipe(
  tap(() => {
    process.exit();
  }),
);

export const serveApp = () => {
  merge(exit$, sigterm$, sigint$).subscribe();

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
