type JsonifiedValue<T> = T extends string | number | null | boolean
  ? T
  : T extends { toJSON(): infer R }
    ? R
    : T extends undefined | ((...args: any[]) => any)
      ? never
      : T extends object
        ? JsonifiedObject<T>
        : never;

type JsonifiedObject<T> = {
  [Key in keyof T as [JsonifiedValue<T[Key]>] extends [never]
    ? never
    : Key]: JsonifiedValue<T[Key]>;
};

type Stringified<ObjType> = string & { source: ObjType };

interface JSON {
  stringify<T>(
    value: T,
    replacer?: null | undefined,
    space?: string | number,
  ): Stringified<T>;
  parse<T>(
    str: Stringified<T>,
    replacer?: null | undefined,
  ): JsonifiedObject<T>;
}

export {};
