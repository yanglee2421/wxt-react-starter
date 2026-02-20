# ESM 模块化

## default

```js
// mod/index.js
export default {};
// use.js
import mod from "./mod";
```

## 具名

```js
// mod.js
export const a = "a";
export const b = 222;
// use.js
import { a, b } from "./mod.js";
```

## 联合使用

```js
// mod.js
export const a = "a";
export default [];
// use.js
import arr, { a } from "./mod.js";
Array.isArray(arr); //true
a === "a"; //true
```

## 统一导出导入

```js
// mod.js
const a = "a";
const b = 222;
export { a, b };
export default Array;
// use.js
import * as mod from "./mod.js";
mod.a === "a"; //true
mod.b === 222; //true
mod.default instanceof Array; //true
```

## 转发

```js
// mod.js
export const a = "a";
export default [];
// forward.js
export { default as arr } from "./mod.js";
// use.js
import { arr } from "./forward.js";
```

## import.meta

```js
// mod.js
import.meta.xxx = "xxx";
export default [];
// use.js
import mod from "./mod.js";
import.meta.xxx === "xxx"; //true
```

## 动态引入

```js
// mod.js
export const a = "a";
export default [];
// use.js
import("./mod.js").then((mod) => {
  mod.a === "a"; //true
  Array.isArray(mod.default); //true
});
```

## 别名

::: code-group

```js [mod.js]
const a = {};
export { a as b };
```

```js [use.js]
import { b as a } from "mod";
```

:::
