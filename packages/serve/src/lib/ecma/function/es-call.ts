export class MyFunction extends Function {
  myCall(target: unknown) {
    const symbol = Symbol();
    const object = toObject(target);
    Reflect.defineProperty(object, symbol, { value: this, enumerable: false });
    return object[symbol]();
  }
}

function toObject(target: unknown) {
  switch (target) {
    case void 0:
    case null:
      return globalThis;
    default:
      return Object(target);
  }
}
