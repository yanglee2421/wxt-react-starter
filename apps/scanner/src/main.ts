import { InterByteTimeoutParser, SerialPort } from "serialport";

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
