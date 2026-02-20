const arr: ((str: string) => void)[] = [];
arr.reduce<Promise<any>>((prev, curr) => {
  return prev.then(curr);
}, Promise.resolve(""));
