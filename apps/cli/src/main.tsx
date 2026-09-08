import addon from "@yanglee2421/cpp-addon";
import { Box, render, Static, Text, useCursor, useInput } from "ink";
import mqtt from "mqtt";
import process from "node:process";
import React from "react";
import { fromEventPattern, merge, switchMap, takeUntil, tap } from "rxjs";

const handleMqtt = () => {
  const client = mqtt.connect("ws://ruihuizg.cn:8083/mqtt", {
    clientId: `location1-info-${Date.now()}`,
    connectTimeout: 5000,
    keepalive: 5,
    reconnectPeriod: 3000,
    clean: true,
  });

  const connect$ = fromEventPattern(
    (f) => client.on("connect", f),
    (f) => client.off("connect", f),
  );
  const reconnect$ = fromEventPattern(
    (f) => client.on("reconnect", f),
    (f) => client.off("reconnect", f),
  );
  const message$ = fromEventPattern<[string, Buffer]>(
    (f) => client.on("message", f),
    (f) => client.off("message", f),
  );
  const error$ = fromEventPattern(
    (f) => client.on("error", f),
    (f) => client.off("error", f),
  );
  const offline$ = fromEventPattern(
    (f) => client.on("offline", f),
    (f) => client.off("offline", f),
  );
  const close$ = fromEventPattern(
    (f) => client.on("close", f),
    (f) => client.off("close", f),
  );
  const device_up$ = fromEventPattern<[unknown]>(
    (f) => client.subscribe("device/up", f),
    (f) => client.unsubscribe("device/up", f),
  );

  return connect$
    .pipe(
      switchMap(() => {
        return merge(
          device_up$.pipe(
            tap(([err]) => {
              if (err) {
                console.error("[MQTT] 订阅 device/up 失败", err);

                return;
              }
              console.log("[MQTT] 已订阅主题 device/up");
            }),
          ),
          reconnect$.pipe(
            tap(() => {
              console.log("reconnect");
            }),
          ),
          message$.pipe(
            tap(([, payload]) => {
              console.log(payload.toString());
            }),
          ),
          error$.pipe(
            tap(() => {
              console.log("error");
            }),
          ),
          offline$.pipe(
            tap(() => {
              console.log("offline");
            }),
          ),
        );
      }),
    )
    .pipe(takeUntil(merge(close$, sigterm$, exit$, sigint$)))
    .subscribe();
};

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

const handleMain = () => {
  addon.ITS_init();
  const opend = addon.ITS_IsOpen();
  console.log("ITS_IsOpen result:", opend);
  const setFrequency = addon.TOFD_PORT_SetFrequency(5000);
  console.log("TOFD_PORT_SetFrequency result:", setFrequency);
  addon.ITS_SetCh(1, 1, 0, 0);
  addon.ITS_SetXmove(200, 200);
  addon.ITS_SetdB(900, 900);
  addon.ITS_SetDis(68000, 68000);
  addon.ITS_SetZip(1024, 1024);
  addon.ITS_SetZeroLeavel(0, 0);
  addon.ITS_SetPlusWidth(0x10, 0x10);
  addon.ITS_Selfcheck(0, 0);
  const leftBuffer = Buffer.alloc(8000);
  const rightBuffer = Buffer.alloc(8000);
  addon.ITS_Start(leftBuffer, rightBuffer);
  const rightEncoder = addon.ITS_GetEncoder(1, 1);
  const leftEncoder = addon.ITS_GetEncoder(1, 0);
  console.log("leftEncoder:", leftEncoder, "rightEncoder:", rightEncoder);
  const result = addon.ITS_Start(leftBuffer, rightBuffer);
  console.log("ITS_Start result:", result, leftBuffer, rightBuffer);
};

const Counter = () => {
  const [inputText, setInput] = React.useState("");
  const [items, setItems] = React.useState<string[]>([]);

  const cursor = useCursor();

  useInput((input, key) => {
    if (key.backspace) {
      setInput((prev) => {
        const val = prev.slice(0, -1);
        cursor.setCursorPosition({ x: val.length, y: 0 });
        return val;
      });
      return;
    }

    if (key.return) {
      switch (inputText) {
        case "1":
          handleMain();
          break;
        case "2":
          handleMqtt();
          break;
        default:
          setItems((prev) => [...prev, inputText]);
          setInput("");
          cursor.setCursorPosition(void 0);
          break;
      }

      return;
    }

    setInput((prev) => {
      const val = prev + input;
      cursor.setCursorPosition({ x: val.length, y: 0 });
      return val;
    });
  });

  return (
    <>
      <Static items={items}>
        {(item, index) => (
          <Box key={index}>
            <Text>{index + 1}. </Text>
            <Text color="blue">{item}</Text>
          </Box>
        )}
      </Static>
      <Text color="red">{inputText}</Text>
    </>
  );
};

export const main = () => {
  merge(exit$, sigterm$, sigint$).subscribe();

  return render(<Counter />);
};

main();
