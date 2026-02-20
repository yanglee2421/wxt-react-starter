# Undefined

- 已声明但没有赋值

## 声明方式

|   关键字   |   变量提升   | 块级作用域 | 重复声明 | 可以改 |
| :--------: | :----------: | :--------: | :------: | :----: |
|   `var`    | 作用域的顶部 |     无     |   允许   |  可以  |
| `function` |   块的顶部   |     无     |   允许   |  可以  |
|   `let`    |     没有     |     有     |  不允许  |  可以  |
|  `const`   |     没有     |     有     |  不允许  | 不可以 |
|  `class`   |     没有     |     有     |  不允许  |  可以  |

## 解构赋值

### 绑定与赋值

::: code-group

```js
let name;
let age;
const arr = [];
const obj = {};
({ name: arr[0], age: obj.age } = { name: "孙悟空", age: 18 }); //[!code warning]这里必须要有括号！
```

```js
let a = 1;
let b = 3;
[a, b] = [b, a];
console.log(a); // 3
console.log(b); // 1
```

:::

::: details

1. 使用 var、let、const 关键字时为绑定模式
2. 不使用 var、let、const 关键字时为赋值模式
3. 赋值模式可以为已存在的变量或是对象属性赋值

:::

### 默认值

::: code-group

```js [obj.js]
// 从对象中解构
const { name = "", age = 0 } = { name: "孙悟空", age: 18 };
```

```js [arr.js]
// 从数组中解构
const [name = "", age = 0] = ["孙悟空", 18];
```

:::

::: tip

- 如果对象中没有对应有 key 或者数组中没有对应的 index，则会将新变量赋值为 undefined
- 上述情况可以为该变量设置一个默认值

:::

### 剩余属性

```js
const { name, ...restObj } = { name: "", age: 18 };
const [name, ...restObj] = ["", 18];
```

### 解构嵌套

```js
const {
  a: { name },
  b: [age],
} = { a: { name: "孙悟空" }, b: [18] };
```

### 其它语法中的解构

除变量的声明和赋值外，还可以在以下场景使用解构：

1. `for...in`和`for...of`循环中
2. 函数的参数
3. `catch`绑定变量

## 解构数组

### 解构比源更多的元素

```js
const foo = ["one", "two"];
const [red, yellow, green, blue] = foo;
console.log(red); // "one"
console.log(yellow); // "two"
console.log(green); // undefined
console.log(blue); //undefined
```

### 忽略某些返回值

```js
function f() {
  return [1, 2, 3];
}
const [a, , b] = f();
console.log(a); // 1
console.log(b); // 3
const [c] = f();
console.log(c); // 1
```

### 使用绑定模式作为剩余属性

```js
const [a, b, ...{ pop, push }] = [1, 2];
console.log(a, b); // 1 2
console.log(pop, push); // [Function pop] [Function push]
const [a, b, ...[c, d, ...[e, f]]] = [1, 2, 3, 4, 5, 6];
console.log(a, b, c, d, e, f); // 1 2 3 4 5 6
```

::: danger
这个语法中不能用来解构对象
:::

### 在任何可迭代对象上使用数组解构

```js
const obj = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  },
};
const [a] = obj;
console.log(a);
const { length } = [];
console.log(length);
```

## 解构对象

### 赋值到新的变量名并提供默认值

```js
const { a: aa = 10, b: bb = 5 } = { a: 3 };
console.log(aa); // 3
console.log(bb); // 5
```

### 从作为函数参数传递的对象中提取属性

::: code-group

```js [user.js]
const user = {
  id: 42,
  displayName: "jdoe",
  fullName: {
    firstName: "Jane",
    lastName: "Doe",
  },
};
```

```js [userId.js]
// 从参数中提取 //[!code focus]
function userId({ id }) {
  return id;
}
console.log(userId(user)); // 42
```

```js [userDisplayName.js]
// 提取并重命名 //[!code focus]
function userDisplayName({ displayName: dname }) {
  return dname;
}
console.log(userDisplayName(user)); // `jdoe`
```

```js [whois.js]
// 从嵌套中提取并重命名 //[!code focus]
function whois({ displayName, fullName: { firstName: name } }) {
  return `${displayName} is ${name}`;
}
console.log(whois(user)); // "jdoe is Jane"
```

```js [drawChart.js]
// 设置函数参数的默认值 //[!code focus]
function drawChart({
  size = "big",
  coords = { x: 0, y: 0 },
  radius = 25,
} = {}) {
  console.log(size, coords, radius);
  // do some chart drawing
}

drawChart({
  coords: { x: 18, y: 30 },
  radius: 30,
});
```

:::

### 解构原始类型

对象解构几乎等同于属性访问。这意味着，如果尝试解构基本类型的值，该值将被包装到相应的包装器对象中，并且在包装器对象上访问该属性。

```js
const { a, toFixed } = 1;
console.log(a, toFixed); // undefined ƒ toFixed() { [native code] }
```

::: danger
undefined 和 null 不能被解构
:::

### 解构对象时查找原型链

当解构一个对象时，如果属性本身没有被访问，它将沿着原型链继续查找。

```js
const obj = {
  self: "123",
  __proto__: {
    prot: "456",
  },
};
const { self, prot } = obj;
// self "123"
// prot "456" (Access to the prototype chain)
```
