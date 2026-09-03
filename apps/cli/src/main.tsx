import addon from "@yanglee2421/cpp-addon";
import { Box, render, Static, Text, useCursor, useInput } from "ink";
import process from "node:process";
import React from "react";
import { fromEventPattern, merge, tap } from "rxjs";

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
        cursor.setCursorPosition({ x: val.length, y: 2 });
        return val;
      });
      return;
    }

    if (key.return) {
      switch (inputText) {
        case "1":
          handleMain();
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
      cursor.setCursorPosition({ x: val.length, y: 2 });
      return val;
    });
  });

  React.useEffect(() => {
    const result = addon.TOFD_PORT_OpenDevice();
    console.log("TOFD_PORT_OpenDevice result:", result);

    return () => {
      const result = addon.TOFD_PORT_CloseDevice();
      console.log("TOFD_PORT_CloseDevice result:", result);
    };
  }, []);

  return (
    <>
      <Text>App Start</Text>
      <Static items={items}>
        {(item, index) => (
          <Box key={index}>
            <Text>{index + 1}. </Text>
            <Text color="blue">{item}</Text>
          </Box>
        )}
      </Static>
      <Text color="cyan">Length: {inputText.length}</Text>
      <Text color="green">Passed: {items.length}</Text>
      <Text color="red">{inputText}</Text>
    </>
  );
};

export const main = () => {
  merge(exit$, sigterm$, sigint$).subscribe();

  return render(<Counter />);
};

main();
