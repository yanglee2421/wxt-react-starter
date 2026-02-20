export function timeout(time: number) {
  return new Promise((res) => setTimeout(res, time));
}
