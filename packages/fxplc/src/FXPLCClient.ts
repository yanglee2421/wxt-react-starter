// ESM source version of FXPLCClient with simplified lazy debug loader
import type { Debugger } from "debug";
import { EventEmitter } from "node:events";
import { createRequire } from "node:module";
import { AsyncLock } from "./async-lock";
import {
  NoResponseError,
  NotSupportedCommandError,
  ResponseMalformedError,
} from "./errors";
import { NumberType, NumberTypeConverters } from "./number-types";
import { calcChecksum } from "./protocol-utils";
import {
  Commands,
  RegisterDef,
  registersMapBits,
  registersMapData,
} from "./registers";

const require = createRequire(import.meta.url);

const STX = 0x02;
const ETX = 0x03;
const NAK = 0x15;
const ACK = 0x06;

// Minimal lazy loader: tries require (CJS build) else falls back to no-op.
let _dbgFn: Debugger | null = null;
function getDbg() {
  if (_dbgFn) return _dbgFn;
  if (typeof require === "function") {
    try {
      _dbgFn = require("debug")("fxplc:client");
      return _dbgFn;
    } catch {
      /* ignore */
    }
  }
  _dbgFn = (..._a: unknown[]) => {};
  return _dbgFn;
}

function bufferToHex(buf: Buffer) {
  return buf.toString("hex");
}
/**
 * FXPLCClient - High-level helper for Mitsubishi FX0N / FX1N style framed protocol.
 * Options:
 *  - retry: { count: number, delayMs: number } (default: {1, 100})
 *  - debug: boolean (enable frame logging)
 *  - timeoutMs: per-operation timeout (default 2000ms)
 */
export class FXPLCClient extends EventEmitter {
  constructor(transport, opts = {}) {
    super();
    this.transport = transport;
    this._lock = new AsyncLock();
    this._retry = opts.retry || { count: 1, delayMs: 100 };
    this._debug = opts.debug || false;
    this._timeoutMs = opts.timeoutMs || 2000;
    if (transport && typeof transport.on === "function") {
      transport.on("connect", (...a) => this.emit("connect", ...a));
      transport.on("disconnect", (...a) => this.emit("disconnect", ...a));
      transport.on("error", (e) => this.emit("error", e));
    }
  }
  /** Close underlying transport (if it supports close) and emit disconnect */
  close() {
    if (this.transport && this.transport.close) this.transport.close();
    this.emit("disconnect");
  }
  /** Batch read registers; coalesces consecutive addresses where possible */
  batchRead(
    registers: RegisterDef[] | string[],
    numberType = NumberType.WordSigned,
    cb: () => void,
  ) {
    if (typeof numberType === "function") {
      cb = numberType;
      numberType = NumberType.WordSigned;
    }
    const prom = (async () => {
      if (!Array.isArray(registers) || registers.length === 0) return [];
      if (!NumberTypeConverters[numberType])
        throw new Error("batchRead: numberType non supportato");
      const regObjs = registers.map((r) => {
        try {
          return r instanceof RegisterDef ? r : RegisterDef.parse(r);
        } catch {
          throw new Error("batchRead: registro non valido: " + r);
        }
      });
      const type = regObjs[0].type;
      if (!registersMapData[type])
        throw new Error("batchRead: tipo registro non supportato: " + type);
      const nums = regObjs.map((r) => r.num);
      const isConsecutive =
        regObjs.every((r) => r.type === type) &&
        nums.every((n, i, a) => i === 0 || n === a[i - 1] + 1);
      if (isConsecutive) {
        const base = registersMapData[type];
        const conv = NumberTypeConverters[numberType];
        const addr = base + regObjs[0].num * 2;
        const data = await this.readBytes(addr, conv.size * regObjs.length);
        const out = [];
        for (let i = 0; i < regObjs.length; ++i)
          out.push(conv.read(data, i * conv.size));
        return out;
      } else {
        return await Promise.all(
          regObjs.map((r) => this.readNumber(r, numberType)),
        );
      }
    })();
    if (cb) prom.then((r) => cb(null, r)).catch((e) => cb(e));
    else return prom;
  }
  /** Batch write registers; packs consecutive region into single write */
  batchWrite(registers, values, numberType = NumberType.WordSigned, cb) {
    if (typeof numberType === "function") {
      cb = numberType;
      numberType = NumberType.WordSigned;
    }
    const prom = (async () => {
      if (!Array.isArray(registers) || registers.length === 0) return;
      if (!Array.isArray(values) || values.length !== registers.length)
        throw new Error("batchWrite: valori non corrispondenti ai registri");
      if (!NumberTypeConverters[numberType])
        throw new Error("batchWrite: numberType non supportato");
      const regObjs = registers.map((r) => {
        try {
          return r instanceof RegisterDef ? r : RegisterDef.parse(r);
        } catch {
          throw new Error("batchWrite: registro non valido: " + r);
        }
      });
      const type = regObjs[0].type;
      if (!registersMapData[type])
        throw new Error("batchWrite: tipo registro non supportato: " + type);
      const nums = regObjs.map((r) => r.num);
      const isConsecutive =
        regObjs.every((r) => r.type === type) &&
        nums.every((n, i, a) => i === 0 || n === a[i - 1] + 1);
      if (isConsecutive) {
        const base = registersMapData[type];
        const conv = NumberTypeConverters[numberType];
        const addr = base + regObjs[0].num * 2;
        const buf = Buffer.alloc(conv.size * regObjs.length);
        for (let i = 0; i < regObjs.length; ++i)
          conv.write(buf, i * conv.size, values[i]);
        await this.writeBytes(addr, buf);
      } else {
        await Promise.all(
          regObjs.map((r, i) => this.writeNumber(r, values[i], numberType)),
        );
      }
    })();
    if (cb) prom.then(() => cb(null)).catch((e) => cb(e));
    else return prom;
  }
  /** Read a single bit (e.g. 'M10') */
  readBit(register, cb) {
    const prom = (async () => {
      if (!register) throw new Error("readBit: registro mancante");
      let reg;
      try {
        reg =
          register instanceof RegisterDef
            ? register
            : RegisterDef.parse(register);
      } catch {
        throw new Error("readBit: registro non valido: " + register);
      }
      return await this._withRetry(async () => {
        const [addr, bit] = reg.getBitImageAddress();
        const bytes = await this.readBytes(addr, 1);
        if (bytes.length !== 1) throw new ResponseMalformedError();
        return (bytes[0] & (1 << bit)) !== 0;
      }, "readBit");
    })();
    if (cb) prom.then((r) => cb(null, r)).catch((e) => cb(e));
    else return prom;
  }
  /** Force a single bit ON/OFF (e.g. 'M10', true) */
  writeBit(register: RegisterDef | string, value: boolean, cb: () => void) {
    const prom = (async () => {
      if (!register) throw new Error("writeBit: registro mancante");
      let reg;
      try {
        reg =
          register instanceof RegisterDef
            ? register
            : RegisterDef.parse(register);
      } catch {
        throw new Error("writeBit: registro non valido: " + register);
      }
      return await this._withRetry(async () => {
        const [topAddress, denominator] = registersMapBits[reg.type];
        if (!topAddress)
          throw new Error(
            "writeBit: tipo registro non supportato: " + reg.type,
          );
        const addr =
          topAddress +
          (Math.floor(reg.num / denominator) * 8 + (reg.num % denominator));
        const buf = Buffer.alloc(2);
        buf.writeUInt16LE(addr, 0);
        await this._sendCommand(
          value ? Commands.FORCE_ON : Commands.FORCE_OFF,
          buf,
        );
      }, "writeBit");
    })();

    if (cb) {
      prom.then(() => cb(null)).catch((e) => cb(e));
    } else {
      return prom;
    }
  }
  /** Convenience: read signed word */
  readInt(register, cb) {
    if (cb)
      this.readNumber(register, NumberType.WordSigned)
        .then((r) => cb(null, r))
        .catch((e) => cb(e));
    else return this.readNumber(register, NumberType.WordSigned);
  }
  /** Read a numeric value using a given NumberType */
  readNumber(register, numberType, cb) {
    if (typeof numberType === "function") {
      cb = numberType;
      numberType = NumberType.WordSigned;
    }
    const prom = (async () => {
      if (!register) {
        throw new Error("readNumber: registro mancante");
      }

      if (!NumberTypeConverters[numberType]) {
        throw new Error("readNumber: numberType non supportato");
      }

      let reg;
      try {
        reg =
          register instanceof RegisterDef
            ? register
            : RegisterDef.parse(register);
      } catch {
        throw new Error("readNumber: registro non valido: " + register);
      }
      return await this._withRetry(async () => {
        const base = registersMapData[reg.type];

        if (base === undefined) {
          throw new Error(
            "readNumber: tipo registro non supportato: " + reg.type,
          );
        }

        const conv = NumberTypeConverters[numberType];
        const addr = base + reg.num * 2;
        const data = await this.readBytes(addr, conv.size);

        if (data.length !== conv.size) {
          throw new ResponseMalformedError();
        }

        return conv.read(data, 0);
      }, "readNumber");
    })();
    if (cb) prom.then((r) => cb(null, r)).catch((e) => cb(e));
    else return prom;
  }
  /** Write a numeric value using a given NumberType */
  writeNumber(register, value, numberType, cb) {
    if (typeof numberType === "function") {
      cb = numberType;
      numberType = NumberType.WordSigned;
    }
    const prom = (async () => {
      if (!register) throw new Error("writeNumber: registro mancante");
      if (!NumberTypeConverters[numberType])
        throw new Error("writeNumber: numberType non supportato");
      let reg;
      try {
        reg =
          register instanceof RegisterDef
            ? register
            : RegisterDef.parse(register);
      } catch {
        throw new Error("writeNumber: registro non valido: " + register);
      }
      return await this._withRetry(async () => {
        const base = registersMapData[reg.type];
        if (base === undefined)
          throw new Error(
            "writeNumber: tipo registro non supportato: " + reg.type,
          );
        const conv = NumberTypeConverters[numberType];
        const addr = base + reg.num * 2;
        const buf = Buffer.alloc(conv.size);
        conv.write(buf, 0, value);
        await this.writeBytes(addr, buf);
      }, "writeNumber");
    })();
    if (cb) prom.then(() => cb(null)).catch((e) => cb(e));
    else return prom;
  }
  /** Read raw bytes from absolute PLC address */
  readBytes(addr, count = 1, cb) {
    const prom = this._withRetry(async () => {
      const req = Buffer.alloc(3); // struct ">HB" big endian: H=2 bytes, B=1
      req.writeUInt16BE(addr, 0);
      req.writeUInt8(count, 2);
      return await this._sendCommand(Commands.BYTE_READ, req);
    }, "readBytes");
    if (typeof count === "function") {
      cb = count;
      count = 1;
    }
    if (cb) prom.then((r) => cb(null, r)).catch((e) => cb(e));
    else return prom;
  }
  /** Write raw bytes to absolute PLC address */
  writeBytes(addr, values, cb) {
    const prom = this._withRetry(async () => {
      const req = Buffer.alloc(3 + values.length);
      req.writeUInt16BE(addr, 0);
      req.writeUInt8(values.length, 2);
      values.copy(req, 3);
      await this._sendCommand(Commands.BYTE_WRITE, req);
    }, "writeBytes");
    if (typeof values === "function") {
      cb = values;
      values = null;
    }
    if (cb) prom.then(() => cb(null)).catch((e) => cb(e));
    else return prom;
  }
  /** Convenience: write signed word */
  writeInt(register, value, cb) {
    if (cb)
      this.writeNumber(register, value, NumberType.WordSigned)
        .then(() => cb(null))
        .catch((e) => cb(e));
    else return this.writeNumber(register, value, NumberType.WordSigned);
  }
  // --- Internals ---
  async _withRetry(fn, opname) {
    let lastErr;
    for (let i = 0; i < this._retry.count; ++i) {
      try {
        return await this._withTimeout(fn, this._timeoutMs);
      } catch (e) {
        lastErr = e;
        if (this._debug) console.warn(`[FXPLCClient] ${opname} errore:`, e);
        this.emit("error", e);
        if (i < this._retry.count - 1)
          await new Promise((r) => setTimeout(r, this._retry.delayMs));
      }
    }
    throw lastErr;
  }
  async _withTimeout(fn, timeoutMs) {
    return await Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new NoResponseError("Timeout operazione")),
          timeoutMs,
        ),
      ),
    ]);
  }
  async _sendCommand(cmd, data) {
    return this._lock.run(async () => {
      const cmdAscii = Buffer.from([0x30 + cmd]);
      const payloadHex = data.toString("hex").toUpperCase();
      const payload = Buffer.concat([
        cmdAscii,
        Buffer.from(payloadHex, "ascii"),
      ]);
      const frameNoChecksum = Buffer.concat([
        Buffer.from([STX]),
        payload,
        Buffer.from([ETX]),
      ]);
      const checksum = calcChecksum(
        Buffer.concat([payload, Buffer.from([ETX])]),
      );
      const frame = Buffer.concat([frameNoChecksum, checksum]);
      if (this._debug) getDbg()("TX", bufferToHex(frame));
      await this.transport.write(frame);
      return await this._readResponse();
    });
  }
  async _readResponse() {
    const first = await this.transport.read(1);
    if (first.length === 0) throw new NoResponseError();
    const code = first[0];
    if (code === STX) {
      const hexParts = [];
      while (true) {
        const b = await this.transport.read(1);
        if (b.length === 0) throw new ResponseMalformedError();
        if (b[0] === ETX) break;
        hexParts.push(b);
      }
      const hexBuf = Buffer.concat(hexParts);
      const checksum = await this.transport.read(2);
      if (checksum.length !== 2) throw new ResponseMalformedError();
      if (
        !calcChecksum(Buffer.concat([hexBuf, Buffer.from([ETX])])).equals(
          checksum,
        )
      )
        throw new ResponseMalformedError("Wrong checksum");
      if (hexBuf.length === 0) return Buffer.alloc(0);
      const out = Buffer.from(hexBuf.toString("ascii"), "hex");
      if (this._debug)
        getDbg()("RX", hexBuf.toString("ascii"), out.toString("hex"));
      return out;
    } else if (code === NAK) {
      throw new NotSupportedCommandError();
    } else if (code === ACK) {
      if (this._debug) getDbg()("RX ACK");
      return Buffer.alloc(0);
    } else {
      throw new NoResponseError();
    }
  }
}
// end class
