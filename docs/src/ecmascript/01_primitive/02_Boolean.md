# Boolean

## falsy & truthy

- JS 中有八个值，在进行布尔运算时视为 false
- 除以下八个值外，其余值均为 thruthy

```js
undefined;
null;
false;
0;
-0;
NaN;
0n;
("");
```

## 函数本身

- 用来作类型转换

```js
const boolean = Boolean("用来生成布尔的值");
boolean == true; //true
boolean === true; //true
```

## 构造器

- 返回一个 boolean 的包装对象

```js
const boolean = new Boolean("用来生成布尔的值");
boolean == true; //true
boolean === true; //false
```

::: danger

1. 原始值不是`new`出来的
2. 包装对象不完全等于原始值

:::
