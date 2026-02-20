import { createServer } from "node:http";
import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import * as kolorist from "kolorist";
import Router from "@koa/router";
import { timeout } from "@/lib/timeout";
import { PrismaClient } from "@prisma/client";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { toParseForm } from "@/lib/toParseForm";
import { PassThrough } from "node:stream";
import { HttpError } from "koa";

function errorHandler(): Middleware {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof HttpError) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = { message: err.message };

        return;
      }

      if (err instanceof Error) {
        ctx.status = 500;
        ctx.body = err;

        return;
      }
    }
  };
}

type App = InstanceType<typeof Koa>;
type Middleware = Parameters<App["use"]>[0];

function log(): Middleware {
  return async (ctx, next) => {
    await next();
    console.log(`url:${ctx.url}`, `method:${ctx.method}`);
  };
}

const stream = new Router({ prefix: "/stream" });

const text =
  "青阳昭武公回想他一生中最温软的时光，是在南淮城的街头，他和他心爱的女孩儿并着肩走，有时候羽然也会拉住他的手，而有的时候她蹦蹦跳跳地走在前面，高声呼喊让他走快一些，曾经在那些深寂的小巷里，她没来由地唱歌，这时吕归尘总是以为他是在做一个很漫长的梦，长到不会再醒来。";

stream.get("/", async (ctx, next) => {
  await next();

  ctx.set({
    "Content-type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const stream = new PassThrough();

  ctx.body = stream;

  ctx.req.on("close", () => {
    clearInterval(interval);
    stream.end();
  });

  let index = 0;
  const interval = setInterval(() => {
    if (index < text.length) {
      stream.write(`event: message\ndata: ${text[index++]}\n\n`);
    } else {
      clearInterval(interval);
      stream.end("event: done\ndata: \n\n");
    }
  }, 100);
});

const upload = new Router({ prefix: "/upload" });

upload.post("/base64", async (ctx, next) => {
  await next();

  const { fields, files } = await toParseForm(ctx.req);
  const { file } = files;
  const f = Array.isArray(file) ? file.at(0) : file;
  if (!f) throw new Error("invalid file");

  const buffer = await readFile(f.filepath);
  const data = buffer.toString("base64");

  ctx.body = { fields, data };
});

upload.post("/save", async (ctx, next) => {
  await next();
  const { fields, files } = await toParseForm(ctx.req);
  const { file } = files;
  const f = Array.isArray(file) ? file.at(0) : file;
  if (!f) throw new Error("invalid file");

  const { filepath, originalFilename } = f;
  const buffer = await readFile(filepath);
  const path = resolve(process.cwd(), "./public");
  await writeFile(`${path}/${originalFilename}`, buffer);

  ctx.body = { path, fields };
});

const userRouter = new Router({ prefix: "/user" });

const prisma = new PrismaClient();

userRouter.get("/", async (ctx, next) => {
  await next();

  ctx.body = await prisma.user.findMany();
});

const chat = new Router({ prefix: "/chat" });

chat.get("/", async (ctx, next) => {
  await next();

  ctx.set("Content-type", "application/octet-stream");

  const text =
    "青阳昭武公回想他一生中最温软的时光，是在南淮城的街头，他和他心爱的女孩儿并着肩走，有时候羽然也会拉住他的手，而有的时候她蹦蹦跳跳地走在前面，高声呼喊让他走快一些，曾经在那些深寂的小巷里，她没来由地唱歌，这时吕归尘总是以为他是在做一个很漫长的梦，长到不会再醒来。";
  for (const chunk of text) {
    await timeout(50);
    ctx.res.write(chunk);
  }
  ctx.res.end();
});

const app = new Koa();

app.use(errorHandler());
app.use(log());
app.use(bodyParser());
app.use(
  cors({
    origin(ctx) {
      return ctx.origin.includes("localhost") ? ctx.origin : "*";
    },
  })
);

app.use(chat.routes());
app.use(upload.routes());
app.use(stream.routes());
app.use(userRouter.routes());

const port = 3002;
createServer(app.callback()).listen(port, () => {
  console.log(`stand by ${kolorist.blue(`http://localhost:${port}`)}`);
});
