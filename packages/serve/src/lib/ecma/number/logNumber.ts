#! deno run

export function logNumber() {
  // ** Decimal
  const num1 = 11;

  // ** Binary
  const num2 = 0b11;

  // ** Octal
  const num3 = 0o11;

  // ** Hexadecimal
  const num4 = 0x11;

  // Scientific Notation
  const num5 = 11e2;

  console.log(num1, num2, num3, num4, num5);
}
