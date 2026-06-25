// TransportNull.js - no-op transport for tests / mock usage
export class TransportNull {
  /** Simulate write (discard data) */
  async write(_data: Buffer) {
    /* noop */
  }
  /** Always resolve with empty buffer */
  async read(_size: number) {
    return Buffer.alloc(0);
  }
  /** No resource to close */
  close() {}
}
