// transport-buffer.js
// Accumulates incoming chunks and fulfills read(size) promises without busy-wait.

export class BufferAccumulator {
  _waiters: Set<{
    size: number;
    timeoutHandle: number | null | NodeJS.Timeout;
    reject: (_: unknown) => void;
    resolve: (_: Buffer) => void;
  }>;
  _length: number;
  _closed: boolean;
  _chunks: [];

  constructor() {
    this._chunks = [];
    this._length = 0;
    this._waiters = new Set(); // elements: {size, resolve, reject, timeoutHandle}
    this._closed = false;
  }

  /** Push new incoming data */
  push(chunk) {
    if (!chunk || chunk.length === 0) {
      return;
    }

    this._chunks.push(chunk);
    this._length += chunk.length;
    this._notify();
  }

  /** Close buffer (reject all pending read promises) */
  close(err?: unknown) {
    this._closed = true;
    for (const w of this._waiters) {
      if (w.timeoutHandle) {
        clearTimeout(w.timeoutHandle);
      }

      w.reject(err || new Error("transport closed"));
    }
    this._waiters.clear();
  }

  _notify() {
    if (this._waiters.size === 0) return;
    for (const w of Array.from(this._waiters)) {
      if (this._length >= w.size) {
        this._waiters.delete(w);
        if (w.timeoutHandle) clearTimeout(w.timeoutHandle);
        try {
          const data = this._consume(w.size);
          w.resolve(data);
        } catch (e) {
          w.reject(e);
        }
      }
    }
  }

  _consume(size: number) {
    if (size > this._length) {
      throw new Error("consume size > buffer length");
    }

    const out = Buffer.alloc(size);
    let off = 0;

    while (off < size) {
      const c = this._chunks[0];
      const need = size - off;

      if (c.length <= need) {
        c.copy(out, off);
        off += c.length;
        this._chunks.shift();
      } else {
        c.copy(out, off, 0, need);
        this._chunks[0] = c.slice(need);
        off += need;
      }
    }
    this._length -= size;
    return out;
  }

  /**
   * Read exactly size bytes or reject on timeout / close.
   * @param {number} size
   * @param {number} timeoutMs optional
   * @returns {Promise<Buffer>}
   */
  read(size: number, timeoutMs: number) {
    if (this._closed) {
      return Promise.reject(new Error("transport closed"));
    }

    if (this._length >= size) {
      return Promise.resolve(this._consume(size));
    }

    return new Promise<Buffer>((resolve, reject) => {
      const waiter = {
        size,
        resolve,
        reject,
        timeoutHandle: null as null | NodeJS.Timeout,
      };

      if (timeoutMs) {
        waiter.timeoutHandle = setTimeout(() => {
          this._waiters.delete(waiter);
          reject(new Error("timeout"));
        }, timeoutMs);
      }

      this._waiters.add(waiter);
    });
  }
}
