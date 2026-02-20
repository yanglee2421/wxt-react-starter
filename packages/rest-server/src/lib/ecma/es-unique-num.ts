#! deno run

export function uniqueNum(nums: number[]) {
  return nums.reduce((prev, item) => prev ^ item, 0);
}

const list = [4, 3, 0, 0, 1, 1, 3];

const res = uniqueNum(list);
console.log(res);
console.log(4 ^ 3 ^ 3 ^ 0 ^ 0 ^ 1 ^ 1);
