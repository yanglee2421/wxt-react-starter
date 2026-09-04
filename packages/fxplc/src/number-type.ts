export const count = (data: Buffer | number) => {
  const buf = Buffer.alloc(1);

  buf.writeUInt8(typeof data === "number" ? data : data.length);

  return encode(buf);
};

export const encode = (data: Buffer) => {
  return Buffer.from(data.toString("hex").toUpperCase(), "ascii");
};

export const decode = (data: Buffer) => {
  return Buffer.from(data.toString("ascii").toUpperCase(), "hex");
};

export const number2WordSigned = (value: number) => {
  const buf = Buffer.alloc(2);
  buf.writeInt16LE(value);

  return buf;
};

export const wordSigned2number = (data: Buffer) => {
  return data.readInt16LE();
};

export const number2WordUnsigned = (value: number) => {
  const buf = Buffer.alloc(2);
  buf.writeUInt16LE(value);

  return buf;
};

export const UnsignedWord2number = (data: Buffer) => {
  return data.readUInt16LE();
};

export const number2DoubleWordSigned = (value: number) => {
  const buf = Buffer.alloc(4);
  buf.writeInt32LE(value);

  return buf;
};

export const doubleWordSigned2number = (data: Buffer) => {
  return data.readInt32LE();
};

export const number2DoubleUnsignedWord = (value: number) => {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(value);

  return buf;
};

export const doubleUnsignedWord2number = (data: Buffer) => {
  return data.readUInt32LE();
};

export const number2Float = (value: number) => {
  const buf = Buffer.alloc(4);
  buf.writeFloatLE(value);

  return buf;
};

export const float2Number = (data: Buffer) => {
  return data.readFloatLE();
};
