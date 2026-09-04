export const calcReadBitAddress = (top: number, denom: number, num: number) => {
  const address = top + Math.floor(num / denom);
  const bit = num % denom;
  const buf = Buffer.alloc(2);
  buf.writeUInt16BE(address);
  const hex = buf.toString("hex").toUpperCase();

  return { bit, hex, buf: Buffer.from(hex, "ascii") };
};

export const calcWriteBitAddress = (
  top: number,
  denom: number,
  num: number,
) => {
  const address = top + Math.floor(num / denom) * 8 + (num % denom);
  const buf = Buffer.alloc(2);
  buf.writeUint16LE(address);

  const hex = buf.toString("hex").toUpperCase();

  return Buffer.from(hex, "ascii");
};

export const calcByteAddress = (base: number, num: number) => {
  const address = base + num * 2;
  const buf = Buffer.alloc(2);
  buf.writeUInt16BE(address);

  const hex = buf.toString("hex").toUpperCase();

  return Buffer.from(hex, "ascii");
};
