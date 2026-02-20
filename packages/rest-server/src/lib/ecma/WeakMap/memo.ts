#! deno run
export function memo(callback: (obj: object) => string[]) {
  const weakMap = new WeakMap<object, string[]>();

  return (obj: object) => {
    // Has cached
    const cachedData = weakMap.get(obj);
    if (cachedData) {
      return cachedData;
    }

    // Not cached
    const data = callback(obj);
    weakMap.set(obj, data);
    return data;
  };
}

const values = memo((obj) => Object.keys(obj));

const obj = {
  name: "Yang",
};

const res = values(obj);
console.log(res);

Reflect.set(obj, "age", 18);
console.log(obj);

console.log(values(obj));
