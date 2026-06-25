// number-types.js
// Definizione NumberType e conversioni Buffer
// number-types.js
// Numeric type identifiers and buffer conversion helpers.

/** Enumerates supported numeric data representations. */
export const NumberType = Object.freeze({
  WordSigned: "WordSigned",
  DoubleWordSigned: "DoubleWordSigned",
  WordUnsigned: "WordUnsigned",
  DoubleWordUnsigned: "DoubleWordUnsigned",
  Float: "Float",
});

/**
 * Map of NumberType -> { size, read, write }
 * read/write operate little-endian per FX memory convention for this implementation.
 */
export const NumberTypeConverters = Object.freeze({
  [NumberType.WordSigned]: {
    size: 2,
    read: (b: Buffer, o = 0) => b.readInt16LE(o),
    write: (b: Buffer, o: number, v: number) => b.writeInt16LE(v, o),
  },
  [NumberType.DoubleWordSigned]: {
    size: 4,
    read: (b: Buffer, o = 0) => b.readInt32LE(o),
    write: (b: Buffer, o: number, v: number) => b.writeInt32LE(v, o),
  },
  [NumberType.WordUnsigned]: {
    size: 2,
    read: (b: Buffer, o = 0) => b.readUInt16LE(o),
    write: (b: Buffer, o: number, v: number) => b.writeUInt16LE(v, o),
  },
  [NumberType.DoubleWordUnsigned]: {
    size: 4,
    read: (b: Buffer, o = 0) => b.readUInt32LE(o),
    write: (b: Buffer, o: number, v: number) => b.writeUInt32LE(v, o),
  },
  [NumberType.Float]: {
    size: 4,
    read: (b: Buffer, o = 0) => b.readFloatLE(o),
    write: (b: Buffer, o: number, v: number) => b.writeFloatLE(v, o),
  },
});
