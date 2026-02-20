# ES2015-2022

## ES2015

1.  声明命令

转到 [let、const](/ecmascript/01_primitive/00_undefined.md#声明方式)

2.  解构赋值

转到 [解构赋值](/ecmascript/01_primitive/00_undefined.md#解构赋值)

3.  字符串处理

    > - 3-1 实例方法
    > - `includes(item, fromIndex)`，判断`item`是否包含在`this`中
    > - `startsWith(item, fromIndex)`，判断`item`串是否在`this`开头
    > - `endsWith(item, fromIndex)`，判断`item`是否在`this`尾部
    > - `repeat(int)`，返回将字符串重复`int`次后拼接成的结果，`int`要求为正整数或 0（-0 也视为 0），不是则会被取整
    > - 3-2 模板字符串
    > - 变量
    > - 换行
    > - 3-3 `for of`可以遍历`String`

    ```js
    for (let i of "str") {
      console.log(i);
    }
    for (let i in "str") {
      console.log(i);
    }
    ```

4.  Arrow Function
    - Arrow Function 中 this 指向声明它的作用域的 this
    - Arrow Function 没有 arguments 参数

```js
const aFun = (params) => value;
```

5. 类
   - 不再建议直接使用 Function 作为构造器

```js
Class Person {
  constructor( name, age ){
    this.name = name
    this.age = age
  }
  callName(){
    console.log( this.name )
  }
  static perProp = "这是仅属于Person的属性"
  static callPerson(){
    console.log( this.perProp )
  }
}
```

6.  简写

    - 对象简写
    - 对象属性名的`[key]`写法
    - 方法简写

```js
const a = "A";
const obj1 = { a };
const obj2 = { [a]: "a" };
const obj3 = { fun() {} };
```

7.  扩展运算符

    - 数组
    - 对象
    - `Set`
    - rest 参数
    - iterator 接口

8.  模块化

- import

```js
// default 导入
import obj from "./file"
// 导入别名
import { default as name } from ""./file
// 统一导入
import * as obj from "./file"
// 具名导入
import { obj, fun } from "./file"
```

- export

```js
// 默认导出
export default {}
// 具名导出
export const obj = {} export function fun(){}
// 统一导出
export { obj, fun }
```

- 转发

```js
export * as Name from "./file";
export { default as Name } from "./file";
```

9. `Symbol`

- 独一无二的值
- Primitive Value 不需要 `new`

- 9-1 创建`Symbol`

> - `Symbol(Description)`
> - `Symbol.for(Description)`
> - `Symbol.keyFor(sym)`

- 9-2 `Symbol.prototype`

> - `description`，只读
> - `toString()`
> - `valueOf()`

- 9-3 `Symbol`

> - `asyncIterator`，异步迭代器方法
> - `iterator`，迭代器方法
> - `toStringTag`，字符串

10. `Set、Map`

- `Set`，不允许重复的，没有索引（索引就是值本身）的`Array`

- 10-1 `Set.prototype`

> - `size`
> - `add(value)`，返回`this`
> - `has(value)`
> - `delete(value)`，删除前返回`has()`的结果
> - `clear()`
> - `entries()`，返回迭`[value, value]`代器对象
> - `keys()`，返回所有`value`的迭代器对象
> - `values()`，同上
> - `forEach()`

```js
const set = new Set([0, 0, 0, 0]);
const set2 = new Set("123456");
```

- `Map`，允许除`String`和`Symbol`以外的类型作键名的`Object`

- 10-2 `Map.protytype`

> - `size`
> - `set(key, value)`，返回`this`
> - `has(key)`
> - `delete(key)`，删除前返回`has()`的结果
> - `get(key)`
> - `clear()`
> - `forEach()`
> - `keys()`，返回所有`key`的迭代对象
> - `values()`，返回所有`value`的迭代对象
> - `entries()`，返回所有`[key,value]`的迭代对象

11. 参数

- 默认值
- 剩余参数

12. `promise`

> - then()
> - catch()

## ES2016

1.  求幂运算符

```js
2 ** 3; //8
9 ** 3; //243
```

2.  `Array.prototype`

> - `includes(item, fromIndex)`，判断`Array`中是否含有`item`

## ES2017

1.  `String.prototype`

> - `padStart(targetLength, padString)`，在`this`的开头填充`padString`（默认为` `）直到`this.length === targetLength`，多的会被截掉
> - `padEnd(targetLength, padString)`，基本同上，在尾部填充

2.  `Object.prototype`

> - `keys()`
> - `values()`
> - `entries()`

3.  `Object`

> - `getOwnPropertyDescriptors(obj, "prop")`，返回对`obj`的`prop`属性的描述（可写、可枚举、可删除...）

4.  `promise`

> - `async/await`

## ES2018

1. 正则

- dotAll

```js
// 开启 s 标志后，. 可以匹配所有字符
const reg = /./s;
```

- 命名捕获组

```js
const reg = /(?<number>\d+)(?<chinese>[^\d]+)/;
const str = "123一二三";
reg.exec(str);
/*
[
  '123一二三',
  '123',
  '一二三',
  index: 0,
  input: '123一二三',
  groups: [Object: null prototype] { number: '123', chinese: '一二三' }
]
*/
reg.exec(str).groups; //{ number: '123', chinese: '一二三' }
str.match(reg).groups; //{ number: '123', chinese: '一二三' }
```

- 先行断言 & 后行断言

```js
// 匹配test，test前必是front，test后必是back
/(?<=front)test(?=back)/;
// 匹配test，test前不是front，test后不是back
/(?<!front)test(?!back)/;
```

- Unicode 转义符

```js
const reg = /\p{sc=Han}/u; //匹配所有汉字
```

2. promise 上的`finally(callback)`以及异步迭代器

```js
const retPro = (par) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(`${par}成功`);
    }, 1000);
  });
};
async function* generator() {
  for (let i = 0; i < 10; i++) {
    yield retPro(i);
  }
}
const iterator = generator();
for await (let i of iterator) {
  console.log(i);
}
```

## ES2019

1. `try...catch...finally`

```js
try {
  console.log("try执行了");
  throw new Error("错误信息");
  // catch 可省略参数
} catch {
  console.log("catch执行了");
  // 新增 finally
} finally {
  console.log("全部执行完了");
}
```

2.  function 上的 `toString()`
3.  Object 上的 `fromEntries(arr)`
4.  array 上的 `flat(int)` & `flatMap(callback)`
5.  string 的 `trimStart()` & `trimEnd()`

## ES2020

1.  string 的`matchAll(reg)`（需要 g 标志）

```js
[ '1', '2', '3', '4' ]
// ---上是match的结果，下是matchAll的结果---
[ '1', index: 0, input: '1一2二3三4四', groups: undefined ]
[ '2', index: 2, input: '1一2二3三4四', groups: undefined ]
[ '3', index: 4, input: '1一2二3三4四', groups: undefined ]
[ '4', index: 6, input: '1一2二3三4四', groups: undefined ]
```

2.  动态引入

```js
import("./file").then((mod) => mod);
```

3.  BigInt

- 安全整数的范围 -2^53-1 ~ 2^53-1

```js
// 字面量
let num = 1n;
//new
let num2 = BigInt(1);
//不能直接与number进行+-*/运算
```

4.  Promise

```js
// 全部得出结果时，返回结果构成的 array
Promise.allSettled([new Promise(() => {})]);
```

5.  globalThis

```js
globalThis === window;
// browser true|node false
globalThis === global;
// browser false|node true
```

6.  可选链操作符

```js
const a = obj?.prop;
obj?.fun?.();
arr?.[1];
```

7. 非空运算符`??`

```js
// 仅 undefined 和 null 视为falsey
const a = "" ?? 1;
// returns ""
```

## ES2021

1. `String.prototype`

> - `replaceAll(oldStr, newStr)`
> - `any(iterable)`，有一个成功就返回成功实例|`race(iterable)`，返回第一个的状态，无论成败

2. 逻辑赋值运算符

```js
x &&= y; // 相当于 x && (x = y)，x为真值就x=y
x ||= y; // 相当于 x || (x = y)，x为假值就x=y
x ??= y; // 相当于 x ?? (x = y)，x为null或undefined就x=y
```

3. 数字分隔符

```js
const a = 1_000;
console.log(a); // 1000
const b = 1_000_000;
console.log(b); // 1000000
```

## ES2022

1.  顶层`await`

2.  string 和 array 的`at(index)`方法

```ts
const arr = [];
const str = "";
arr.at(-1);
str.at(-1);
```
