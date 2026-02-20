export function uniqBy<TData>(params: Params<TData>) {
  const map = new Map<unknown, TData>();

  params.list.forEach((item) => {
    // Item must be an object
    if (typeof item !== "object") {
      console.error("Excepted an object");
      return;
    }

    if (!item) {
      console.error("Excepted an object, got a null!");
      return;
    }

    // Get key for map
    const mapKey = Reflect.get(item, params.property);
    if (!mapKey) {
      console.error("mapKey must be a truth, got a falsy!");
      return;
    }

    // Whether to allow overwriting
    if (params.overwrite) {
      map.set(mapKey, item);
      return;
    }

    map.get(mapKey) ?? map.set(mapKey, item);
  });

  return [...map.values()];
}

interface Params<TData> {
  list: TData[];
  property: string | symbol;
  overwrite?: boolean;
}
