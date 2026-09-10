import addon from "@yanglee2421/cpp-addon";
import { Box, render, Static, Text, useCursor, useInput } from "ink";
import React from "react";
import { MqttDemo } from "./mqtt";

const handleMqtt = () => {
  const demo = new MqttDemo();
  demo.mqttURI$.next("ws://ruihuizg.cn:8083/mqtt");
  demo.deviceId$.next("26");

  return demo;
};

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

  const ref = React.useRef<MqttDemo | null>(null);

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
          ref.current = handleMqtt();
          setItems((prev) => [...prev, inputText]);
          setInput("");
          cursor.setCursorPosition(void 0);
          break;
        case "3":
          ref.current?.dispose();
          setItems((prev) => [...prev, inputText]);
          setInput("");
          cursor.setCursorPosition(void 0);
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
  return render(<Counter />);
};

main();
