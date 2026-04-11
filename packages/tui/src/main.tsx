import { Box, render, Static, Text, useCursor, useInput } from "ink";
import React from "react";

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
      <Text color="green">tests passed: {items.length}</Text>
      <Text color="red">{inputText}</Text>
    </>
  );
};

render(<Counter />);
