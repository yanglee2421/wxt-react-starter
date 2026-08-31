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
      setItems((prev) => [...prev, inputText]);
      setInput("");
      cursor.setCursorPosition(void 0);
      return;
    }

    setInput((prev) => {
      const val = prev + input;

      cursor.setCursorPosition({ x: val.length, y: 2 });

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
