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
    cursor.setCursorPosition({ x: 10, y: 1 });

    if (key.backspace) {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (key.return) {
      setItems((prev) => [...prev, inputText]);
      setInput("");
    }

    setInput((prev) => prev + input);
  });

  return (
    <>
      <Static items={items}>
        {(item, index) => (
          <Box key={index}>
            <Text color="blue">{item}</Text>
          </Box>
        )}
      </Static>
      <Text color="green">passed: {items.length}</Text>
      <Text color="red">{inputText}</Text>
    </>
  );
};

export const main = () => {
  merge(exit$, sigterm$, sigint$).subscribe();

  return render(<Counter />);
};
