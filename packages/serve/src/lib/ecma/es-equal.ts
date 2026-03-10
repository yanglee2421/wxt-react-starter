#! deno run

export function esEqual() {
  const symbol = Symbol();

  const object = {
    [symbol]: 0,

    // Highest Priority
    [Symbol.toPrimitive]() {
      return ++this[symbol];
    },

    // Takes precedence over toString for anything other than string
    valueOf() {
      return ++this[symbol];
    },

    // Prefer valueOf in the case of strings
    toString() {
      return this[symbol]++;
    },
  };

  // @ts-ignore
  console.log(object == 1, object == 2);
}
esEqual();
console.log(void 0 == null);
console.log(void 0 === null);

/**
 * 1. Special: undefined, null, ,NaN, symbol
 * 2. Same Type: then compare the value
 * 3. Both Are Primitive: convert to number
 * 4. Primitive & Object: convert to primitive by Symbol.toPrimitive valueOf, toString
 */
