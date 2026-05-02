import { container } from "@/features";
import { serve } from "@hono/node-server";
import { schema } from "@yanglee2421/db";
import { render } from "ink";
import { App } from "./App";
import { factory } from "./infra/app-factory";

const db = container.cradle.db.client;

const main = () => {
  const app = factory.createApp();

  app.get("/", async (c) => {
    const rows = await db.select().from(schema.users);

    return c.json({ rows });
  });

  const server = serve({ ...app, port: 8080 });
  render(<App />);

  // graceful shutdown
  process.on("SIGINT", () => {
    server.close();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    server.close((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    });
  });
};

main();
