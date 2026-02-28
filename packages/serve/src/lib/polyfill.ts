type CallbackFn<TArgs extends unknown[], TReturn> = (...args: TArgs) => TReturn;

export const promiseTry = <TArgs extends unknown[], TReturn>(
  callback: CallbackFn<TArgs, TReturn>,
  ...args: TArgs
): Promise<TReturn> => {
  return new Promise<TReturn>((resolve) => resolve(callback(...args)));
};

export const arrayWith = <TEl>(array: TEl[], index: number, element: TEl) => {
  return Array.from(array, (el, idx) => {
    if (idx === index) {
      return element;
    }

    return el;
  });
};

export const mapGroupBy = <TElement, TKey>(
  items: TElement[],
  callbackFn: CallbackFn<[TElement, number], TKey>,
): Map<TKey, TElement[]> => {
  const resultMap = new Map<TKey, TElement[]>();

  items.reduce((latestResult, item, index) => {
    const mapKey = callbackFn(item, index);
    const mapValue = latestResult.get(mapKey);

    if (Array.isArray(mapValue)) {
      mapValue.push(item);
    } else {
      latestResult.set(mapKey, [item]);
    }

    return latestResult;
  }, resultMap);

  return resultMap;
};
