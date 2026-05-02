import { Box, Newline, Static, Text, useInput } from "ink";
import React from "react";
import { serve } from "./serve";

interface CommandProps {
  input: string;
}

const Command = ({ input }: CommandProps) => {
  switch (input) {
    case "1":
      return <Text color="green">Server started</Text>;
    case "2":
      return <Text color="red">Server stopped</Text>;
    default:
      return <Text color="yellow">Unknown command</Text>;
  }
};

interface Test {
  id: number;
  title: string;
  input: string;
}

export const App = () => {
  const [inputText, setInputText] = React.useState("");
  const [tests, setTests] = React.useState<Test[]>([]);

  const serverRef = React.useRef<ReturnType<typeof serve> | null>(null);

  useInput((input, key) => {
    void key;
    setInputText(input);
    setTests((prevTests) => [
      ...prevTests,
      { id: prevTests.length + 1, title: `Input received: ${input}`, input },
    ]);

    if (input === "1") {
      serverRef.current?.close();
      serverRef.current = serve();
    }

    if (input === "2") {
      serverRef.current?.close();
    }
  });

  React.useEffect(() => {
    const handleSigint = () => {
      serverRef.current?.close();
      process.exit(0);
    };

    const handleSigterm = () => {
      serverRef.current?.close((err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        process.exit(0);
      });
    };

    // graceful shutdown
    process.on("SIGINT", handleSigint);
    process.on("SIGTERM", handleSigterm);

    return () => {
      process.off("SIGINT", handleSigint);
      process.off("SIGTERM", handleSigterm);
    };
  }, []);

  return (
    <React.StrictMode>
      <Static items={tests}>
        {(test) => (
          <Box key={test.id}>
            <Text>
              <Text color="green">✔ {test.title}</Text>
              <Newline />
              <Command input={test.input} />
            </Text>
          </Box>
        )}
      </Static>
      <Box marginTop={1}>
        <Text>
          {tests.length === 0 && (
            <>
              <Text dimColor>
                Type "1" to start the server, "2" to stop the server.
              </Text>
              <Newline />
            </>
          )}
          <Text dimColor>Latest input: {inputText}</Text>
        </Text>
      </Box>
    </React.StrictMode>
  );
};
