export function withTruth(list: unknown[]) {
  return list.some(Boolean);
}
