import { drizzle } from "drizzle-orm/node-sqlite";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import timers from "node:timers";
import url from "node:url";
import {
  BehaviorSubject,
  distinctUntilChanged,
  last,
  NEVER,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  using,
} from "rxjs";
import { relations } from "./relations";
import * as schema from "./schema";

const createDBClient = (dbPath: string) => {
  console.log("open database");

  const client = new DatabaseSync(dbPath);
  const db = drizzle({ client, schema, relations });

  return db;
};

type DBClient = ReturnType<typeof createDBClient>;

export const createClient = () => {
  const path$ = new Subject<string>();
  const client$ = new BehaviorSubject<DBClient | null>(null);

  const subscription = path$
    .pipe(
      distinctUntilChanged(),
      switchMap((dbPath) => {
        if (!dbPath) {
          return of(null);
        }

        return using(
          () => {
            const db = createDBClient(dbPath);

            return {
              unsubscribe: () => {
                console.log("close database");
                db.$client.close();
              },
              db,
            };
          },
          (c) => {
            const db: DBClient = Reflect.get(Object(c), "db");

            return NEVER.pipe(startWith(db));
          },
        );
      }),
      takeUntil(path$.pipe(last())),
      shareReplay({ bufferSize: 1, refCount: true }),
    )
    .subscribe({
      next: (db_) => {
        client$.next(db_);
      },
      error: () => {
        client$.complete();
      },
      complete: () => {
        client$.complete();
      },
    });

  return {
    client$,
    path$,
    subscription,
  };
};

const main = async () => {
  const { path$: dbPath$, client$: dbClient$ } = createClient();
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const DB_PATH = path.resolve(__dirname, "./local.db");

  dbPath$.next(DB_PATH);
  const db = dbClient$.value;

  if (db !== null) {
    const result = await db.select().from(schema.yqConfig);
    console.log(result);
  }

  dbPath$.next("");
  await timers.promises.setTimeout(1000 * 5);
  dbPath$.next(DB_PATH);
  await timers.promises.setTimeout(1000 * 5);
  dbPath$.next("");
};

main();
