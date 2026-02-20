export function jsonClone<TData = unknown>(params: TData) {
  try {
    const neoObject: TData = JSON.parse(JSON.stringify(params));
    return neoObject;
  } catch (error) {
    console.error(error);
    return null;
  }
}
