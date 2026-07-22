import { Commands, Controls } from "./constants";
import { count, encode } from "./number-type";

export const calcCheckSum = (payload: Buffer | string) => {
  const buf =
    typeof payload === "string" ? Buffer.from(payload, "ascii") : payload;
  const checkSum = buf.reduce((a, b) => a + b) & 0xff;

  return Buffer.from(
    checkSum.toString(16).padStart(2, "0").toUpperCase(),
    "ascii",
  );
};

export const forceBit = (address: Buffer, value: boolean) => {
  const payload = Buffer.concat([
    value ? Commands.FORCE_ON.buf : Commands.FORCE_OFF.buf,
    address,
    Controls.ETX.buf,
  ]);
  const frame = Buffer.concat([
    Controls.STX.buf,
    payload,
    calcCheckSum(payload),
  ]);

  return frame;
};

export const readBit = (address: Buffer) => {
  const payload = Buffer.concat([
    Commands.BYTE_READ.buf,
    address,
    count(1),
    Controls.ETX.buf,
  ]);
  const frame = Buffer.concat([
    Controls.STX.buf,
    payload,
    calcCheckSum(payload),
  ]);

  return frame;
};

export const readByte = (address: Buffer, countNumber: number) => {
  const payload = Buffer.concat([
    Commands.BYTE_READ.buf,
    address,
    count(countNumber),
    Controls.ETX.buf,
  ]);
  const frame = Buffer.concat([
    Controls.STX.buf,
    payload,
    calcCheckSum(payload),
  ]);

  return frame;
};

export const writeByte = (address: Buffer, data: Buffer) => {
  const payload = Buffer.concat([
    Commands.BYTE_WRITE.buf,
    address,
    count(data),
    encode(data),
    Controls.ETX.buf,
  ]);
  const checkSum = calcCheckSum(payload);
  const frame = Buffer.concat([Controls.STX.buf, payload, checkSum]);

  return frame;
};

export const resolveResult = (response: Buffer) => {
  let data = Buffer.alloc(0);

  for (const item of response) {
    if (item === Controls.STX.hex) {
      continue;
    }

    if (item === Controls.ETX.hex) {
      break;
    }

    data = Buffer.concat([data, Buffer.from([item])]);
  }

  return data;
};

export const resolveCheckSum = (response: Buffer) => {
  let startRecive = false;
  let result = Buffer.alloc(0);

  for (const item of response) {
    if (item === Controls.ETX.hex) {
      startRecive = true;
      continue;
    }

    if (startRecive) {
      result = Buffer.concat([result, Buffer.from([item])]);
    } else {
      continue;
    }
  }

  return result;
};
