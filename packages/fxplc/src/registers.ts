// registers.js
// Register type enums, address mapping tables and RegisterDef helper.

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

export class RegisterDef {
  type: string;
  num: number;

  /**
   * @param {string} regType Single-letter register type (e.g. 'M','D','X')
   * @param {number} num Numeric index
   */
  constructor(regType: string, num: number) {
    this.type = regType;
    this.num = num;
  }

  toString() {
    return `${this.type}${this.num}`;
  }

  /**
   * Returns tuple [byteAddress, bitIndex] inside the bit image area.
   * Throws if bit index would exceed 0..7 (denominator encodes packing per byte).
   */
  getBitImageAddress() {
    const info = Reflect.get(registersMapBitImages, this.type) as
      | [number, number]
      | undefined;

    if (!info) {
      throw new Error("Unsupported register type for bit image: " + this.type);
    }

    const [topAddress, denominator] = info;
    const byteAddr = topAddress + Math.floor(this.num / denominator);
    const bit = this.num % denominator;

    if (bit >= 8) {
      throw new Error("Bit out of range (>=8)");
    }

    return [byteAddr, bit];
  }

  /** Parses a textual definition like 'D100' into a RegisterDef */
  static parse(definition: string) {
    if (!definition || typeof definition !== "string") {
      throw new Error("Invalid definition");
    }

    const regType = definition[0];
    const num = parseInt(definition.slice(1), 10);

    if (Number.isNaN(num)) {
      throw new Error("Invalid register number");
    }

    return new RegisterDef(regType, num);
  }
}

export const Commands = Object.freeze({
  BYTE_READ: 0,
  BYTE_WRITE: 1,
  FORCE_ON: 7,
  FORCE_OFF: 8,
});
