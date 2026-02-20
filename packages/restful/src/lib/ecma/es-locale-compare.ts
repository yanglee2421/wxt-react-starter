#! deno run

export function toSortByAccent(list: string[]) {
  return list.sort((curr, next) => {
    return curr.localeCompare(next, "zh-Hans-CN", {
      sensitivity: "accent",
    });
  });
}

const arr = ["张", "王", "刘", "李", "陈", "杨"];
const list = toSortByAccent(arr);
console.log(list);
