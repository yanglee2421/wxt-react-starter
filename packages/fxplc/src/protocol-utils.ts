// protocol-utils.js
// Funzioni di supporto protocollo (checksum)
// protocol-utils.js
// Protocol helper functions (checksum, etc.).

export function calcChecksum(payload: Buffer) {
  // payload: Buffer (payload + ETX in original Python logic)
  const sum = payload.reduce((a, b) => a + b, 0);
  const hex = (sum & 0xff).toString(16).toUpperCase().padStart(2, "0");
  return Buffer.from(hex, "ascii");
}
