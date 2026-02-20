export function isPowerOf2(x: number) {
  return (x & (x - 1)) === 0;
}
