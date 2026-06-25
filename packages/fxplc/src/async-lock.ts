// async-lock.js
// Semplice mutex promise-based per serializzare le operazioni sul transport
// Simple promise-based mutex to serialize protocol frame operations over a transport.

/**
 * Lightweight async lock (FIFO-ish) that chains promises to guarantee mutual exclusion.
 * Usage:
 *   const lock = new AsyncLock();
 *   await lock.run(async () => { /* critical section */ /* });
 */
export class AsyncLock {
  _p: Promise<void>;

  constructor() {
    this._p = Promise.resolve();
  }

  async run(fn: () => Promise<void>) {
    const runPrev = this._p;
    const { resolve, promise } = Promise.withResolvers<void>();
    this._p = promise;

    try {
      await runPrev; // wait previous chain completion
      return await fn();
    } finally {
      resolve();
    }
  }
}
