const object = {
  b: "b",
  c: "c",
  a: "a",
  3: 3,
  4: 4,
  1: 1,
  2: 2,
};

console.log("keys", Object.keys(object).join());
console.log("values", Object.values(object).join());
console.log(
  "for in",
  (() => {
    const kList: string[] = [];
    for (const k in object) {
      kList.push(k);
    }
    return kList.join();
  })()
);
