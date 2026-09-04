import { createAutumnfishAxios } from "@/features/autumnfish/axiosAutumnfish";
import { createBingAxios } from "@/features/bing/axiosBing";
import { defaultDbUrl } from "@yanglee2421/db";
import { asClass, asFunction, asValue, createContainer } from "awilix";
import { DBService } from "./db";
import { HashService } from "./hash/hash";
import type { AppCradle } from "./types";

export const container = createContainer<AppCradle>({
  strict: true,
  injectionMode: "PROXY",
});

container.register({
  dbPath: asValue(defaultDbUrl),
  rounds: asValue(10),

  db: asClass(DBService)
    .singleton()
    .disposer((db) => db.dispose()),
  hash: asClass(HashService).singleton(),
  axiosBing: asFunction(createBingAxios).singleton(),
  axiosAutumnfish: asFunction(createAutumnfishAxios).singleton(),
});
