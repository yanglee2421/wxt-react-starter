// TransportSerial.js - Serial transport implementation using BufferAccumulator.
import type { SerialPort } from "serialport";
import { NoResponseError, NotConnectedError } from "./errors";
import { BufferAccumulator } from "./transport-buffer";

interface TransportSerialConstructorParams {
  path: string;
  baudRate: number;
  timeout: number;
}

export class TransportSerial {
  path: string;
  baudRate: number;
  timeout: number;
  _opened: boolean;
  _port: SerialPort | null;
  _bufferAcc: BufferAccumulator;

  /**
   * @param {object} opts
   * @param {string} opts.path Serial device path (e.g. COM3, /dev/ttyUSB0)
   * @param {number} [opts.baudRate=9600] Baud rate
   * @param {number} [opts.timeout=1000] Read timeout in ms
   */
  constructor({
    path,
    baudRate = 9600,
    timeout = 1000,
  }: TransportSerialConstructorParams) {
    this.path = path;
    this.baudRate = baudRate;
    this.timeout = timeout;
    this._opened = false;
    this._port = null;
    this._bufferAcc = new BufferAccumulator();
  }

  /** Lazily open the serial port */
  async _ensureOpen() {
    if (this._opened) return;
    let SerialPort;
    try {
      ({ SerialPort } = await import("serialport"));
    } catch {
      throw new Error(
        "Dipendenza 'serialport' non installata o non disponibile",
      );
    }
    await new Promise<void>((resolve, reject) => {
      const port = new SerialPort(
        {
          path: this.path,
          baudRate: this.baudRate,
          dataBits: 7,
          stopBits: 1,
          parity: "even",
          autoOpen: true,
          lock: false,
        },
        (err) => {
          if (err) {
            return reject(err);
          }

          resolve();
        },
      );
      this._port = port;
      port.on("data", (d) => this._bufferAcc.push(d));
      port.on("error", () => this.close());
      port.on("close", () => this._bufferAcc.close());
    });
    this._opened = true;
  }

  /** Write raw frame data; resets accumulator before each request */
  async write(data: Buffer) {
    await this._ensureOpen();

    if (!this._port) {
      throw new NotConnectedError();
    }

    // reset buffer logico prima della richiesta
    this._bufferAcc = new BufferAccumulator();
    await new Promise<void>((resolve, reject) =>
      this._port?.write(data, (err) => (err ? reject(err) : resolve())),
    );
  }

  /** Read bytes from buffer accumulator */
  async read(size: number) {
    await this._ensureOpen();
    if (!this._port) throw new NotConnectedError();
    try {
      return await this._bufferAcc.read(size, this.timeout);
    } catch {
      throw new NoResponseError();
    }
  }

  /** Close port (idempotent) */
  close() {
    if (this._port) {
      try {
        this._port.close();
      } catch {
        /*noop*/
      }
      this._port = null;
    }
    this._opened = false;
    this._bufferAcc.close();
  }
}
