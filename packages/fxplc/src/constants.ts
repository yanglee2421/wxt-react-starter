export const RegisterType = Object.freeze({
  State: "S",
  Input: "X",
  Output: "Y",
  Timer: "T",
  Memory: "M",
  Data: "D",
  Counter: "C",
});

export const registersMapBitImages = Object.freeze({
  S: [0x0000, 8],
  X: [0x0080, 10],
  Y: [0x00a0, 10],
  T: [0x00c0, 8],
  M: [0x0100, 8],
  D: [0x1000, 8],
});

export const registersMapData = Object.freeze({
  T: 0x0800,
  C: 0x0a00,
  D: 0x1000,
});

export const registersMapBits = Object.freeze({
  S: [0x0000, 8],
  X: [0x0400, 10],
  Y: [0x0500, 10],
  T: [0x0600, 8],
  M: [0x0800, 8],
});

export const Commands = Object.freeze({
  BYTE_READ: { hex: 0x30, ascii: "0", buf: Buffer.from("0", "ascii") },
  BYTE_WRITE: { hex: 0x31, ascii: "1", buf: Buffer.from("1", "ascii") },
  FORCE_ON: { hex: 0x37, ascii: "7", buf: Buffer.from("7", "ascii") },
  FORCE_OFF: { hex: 0x38, ascii: "8", buf: Buffer.from("8", "ascii") },
});

export const Controls = Object.freeze({
  STX: { hex: 0x02, ascii: "\x02", buf: Buffer.from([0x02]) },
  ETX: { hex: 0x03, ascii: "\x03", buf: Buffer.from([0x03]) },
  NAK: { hex: 0x15, ascii: "\x15", buf: Buffer.from([0x15]) },
  ACK: { hex: 0x06, ascii: "\x06", buf: Buffer.from([0x06]) },
});
