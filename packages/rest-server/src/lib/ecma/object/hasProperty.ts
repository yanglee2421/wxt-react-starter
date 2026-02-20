export function hasProperty(object: Object, key: string | symbol) {
  // ** Recommend
  const case1 = key in object;
  // Enumerable String
  const case2 = Object.keys(object).some((item) => item === key);
  // Not Prototype
  const case3 = object.hasOwnProperty(key);
  console.log(case1, case2, case3);
}
