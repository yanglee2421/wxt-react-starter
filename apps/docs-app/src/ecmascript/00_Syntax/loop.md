# 循环

## for

```js
out: for (let j = 0; j < 10; j++) {
  inner: for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) continue;
    if (i === 7) break out;
  }
}
```

### for...in...

- 遍历所有可枚举属性，包括原型链上的

```js
for (const i in "string");
for (const i in [0, 1, 2, 3]);
for (const i in { name: "张三", age: 18 });
```

### for...of...

- 遍历 iterable

```js
for (const i of "string");
for (const i of [0, 1, 2, 3]);
for (const i of new Set([1, 2, 3]));

function* Iter() {
  yield "第一次";
  yield "第二次";
  yield "第三次";
  return "第四次";
}
const iter = Iter();
for (const i of iter);
const iter01 = Iter();
iter01.next(); //{value:"第一次", done:false}
iter01.next(); //{value:"第二次", done:false}
iter01.next(); //{value:"第三次", done:false}
iter01.next(); //{value:"第四次", done:true}
```

### for await...of

- 遍历异步 iterable

```js
async function* Iter() {
  yield "第一次";
  yield "第二次";
  yield "第三次";
  return "第四次";
}
const iter = Iter();
(async () => {
  for await (const item of iter);
})();
```

## while

```js
/**
 * while后为falsy则循环继承
 */
let i = 0;
while (i < 10) {
  i++;
}
```
