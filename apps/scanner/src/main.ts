import net from "node:net";
import { InterByteTimeoutParser, SerialPort } from "serialport";

export const scanBySerialPort = () => {
  const port = new SerialPort({
    path: "COM1",
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
  });

  // const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  const parser = port.pipe(new InterByteTimeoutParser({ interval: 30 }));

  parser.on("data", (data: Buffer) => {
    console.log("Data:", data.toString());
  });

  console.log("Scanner ready:");
};

export const scanAsTCPClient = () => {
  const client = net.createConnection(
    {
      host: "192.168.2.199",
      port: 9601,
    },
    () => {
      console.log("已连接服务器");
    },
  );

  client.on("data", (data) => {
    console.log("收到服务端:", data.toString());
  });

  client.on("close", () => {
    console.log("连接关闭");
  });

  client.on("error", (error) => {
    console.error(error);
  });
};

export const scanAsTCPServer = () => {
  const server = net.createServer((socket) => {
    console.log("客户端已连接");

    // 收到数据
    socket.on("data", (data) => {
      console.log("收到:", data.toString());
    });

    // 连接关闭
    socket.on("close", () => {
      console.log("客户端断开");
    });

    // 错误处理
    socket.on("error", (err) => {
      console.error("socket error:", err);
    });
  });

  server.listen(9606, "0.0.0.0", () => {
    console.log("TCP Server listening on 9606");
  });
};
