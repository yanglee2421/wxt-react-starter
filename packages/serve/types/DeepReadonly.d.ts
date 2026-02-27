export type DeepReadonly<TObject extends Record<string | symbol, any>> = {
  readonly [TKey in keyof TObject]: DeepReadonly<TObject[TKey]>;
};

interface Obj {
  name: string;
  obj: {
    name: string;
  };
}

const obj2: DeepReadonly<Obj> = {
  name: "",
  obj: {
    name: "",
  },
};

obj2.obj.name;
