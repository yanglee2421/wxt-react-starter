export function withoutFalsy(list: unknown[]) {
  return list.every(Boolean);
}
