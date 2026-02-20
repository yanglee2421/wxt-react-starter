# Number

## 进制

- 十进制整数字面量由一串数字序列组成，且没有前缀 0。
- 八进制的整数以 0（或 0O、0o）开头，只能包括数字 0-7。
- 十六进制整数以 0x（或 0X）开头，可以包含数字（0-9）和字母 a~f 或 A~F。
- 二进制整数以 0b（或 0B）开头，只能包含数字 0 和 1。

## 静态方法

- [isNaN](#isnan)

## 实例方法

1. [toFixed](#tofixed)
2. [toString](#tostring)

## 示例

### isNaN

```js
globalThis.isNaN("NaN"); //true
Number.isNaN("NaN"); //false
```

:::tip
与 globalThis.isNaN 不同，Number.isNaN 不会进行类型转换
:::

### toFixed

```js
const num = 10;
const str = num.toFixed(2); //10.00
```

:::warning
返回的是 string
:::

### toString

```js
const num = 2;
const str = num.toString(2); //10
```

:::warning

- 用于进行进制转换
- 返回是 string

:::
