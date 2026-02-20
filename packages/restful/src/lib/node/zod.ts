#! pnpm tsx
import { z } from "zod";

// Primitive & Parse
console.log(
  z
    .object({
      bigint: z.bigint(),
      boolean: z.boolean(),
      number: z.number(),
      string: z.string(),
      symbol: z.symbol(),
      undefined: z.undefined(),
      null: z.null(),
    })
    .parse({
      bigint: 0n,
      boolean: false,
      number: 0,
      string: "",
      symbol: Symbol(),
      undefined: void 0,
      null: null,
    })
);

// Object & Parse async
z.object({
  array: z.array(z.string().optional()).nonempty(),
  date: z.date(),
  function: z
    .function()
    .args(z.string().nullable(), z.number().nullish())
    .returns(z.void()),
  map: z.map(z.string(), z.number()),
  promise: z.promise(z.void()),
  set: z.set(z.number()),
})
  .parseAsync({
    array: [void 0],
    date: new Date(),
    function() {},
    map: new Map([["", 0]]),
    promise: Promise.resolve(),
    set: new Set([0]),
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });

// Class & Transform & Safe parse
class Test {
  constructor() {}
}

console.log(z.instanceof(Test).transform(Boolean).safeParse(new Test()));

// TypeScript & Safe parse async
enum CodeEnum {
  caseOne = "one",
  caseTwo = "two",
}

export const tsSchema = z.object({
  any: z.any(),
  unknown: z.unknown(),
  never: z.never(),
  void: z.void(), // accepts undefined

  enum: z.enum(["one", "two"]),
  nativeEnum: z.nativeEnum(CodeEnum),

  records: z.record(z.number()),
  tuple: z.tuple([z.number(), z.string()]),
});

export type SchemaType = z.infer<typeof tsSchema>;

// Or & And
const schemaOne = z.object({
  name: z.ostring(),
  age: z.onumber(),
  sex: z.oboolean(),
});

const schemaTwo = z.object({
  size: z.number().optional(),
});

z.union([schemaOne, schemaTwo]);
schemaOne.or(schemaTwo);

z.intersection(schemaOne, schemaTwo);
schemaOne.and(schemaTwo);

schemaOne.extend(schemaTwo.shape);
schemaOne.merge(schemaTwo);
schemaOne.pick({ name: true });
schemaOne.omit({ age: true });
schemaOne.partial();
schemaOne.required();
schemaOne.passthrough();
schemaOne.strict();
schemaOne.strip();
schemaOne.catchall(z.boolean());

// Refine & Safe parse async
z.any().refine(async (value) => typeof value === "object", {
  message: "is not object",
});
