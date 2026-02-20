const accentSort = (arr: string[]) =>
  arr.sort((current: string, next: string) =>
    current.localeCompare(next, "zh-Hans-CN", { sensitivity: "accent" })
  );
export default accentSort;
const arr = ["张", "王", "刘", "李", "陈", "杨"];
accentSort(arr);
// returns [ '陈', '李', '刘', '王', '杨', '张' ]
