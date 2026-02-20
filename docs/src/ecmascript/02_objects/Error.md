# Error

## 构造器

```js
// 简写
const err = new Error("可读的错误信息");
err.message; //"可读的错误信息"

// 完整写法
const err01 = new Error("msg", { cause: "cause" });
err.message; //"msg"
err.cause; //"cause"
err.name; //"Error"
```

## 实例属性

- [message](#message)
- [cause](#cause)
- [name](#name)

## 实例方法

- [toString](#tostring)

## 案例

### message

```js
const err = new Error("错误信息");
err.message; //"错误信息"
```

### cause

```js
const err = new Error("错误信息", { cause: "原因" });
err.cause; //"原因"
```

### name

```js
const terr = new TypeError("xxx");
err.name; //"TypeError"
```

### toString

```js
const err = new Error("msg");
err.toString();
```

## try...catch...finally & throw

```js
try {
  throw new Error("出现错误");
} catch (err) {
  /**
   * 若try后的代码块中没有抛出错误，则这个代码块不执行
   * err为try后的代码块中被throw关键字抛出的信息，
   * err可以不是Error对象
   * err可以省略，省略时只保留一个catch关键字
   */
  console.error(err.message);
} finally {
  // 此处的return视为整个try...catch...finally语句的return
  // 即使try块或catch块中已经return或throw，finally块依然会被执行
  console.log("不管catch执不执行，这里都执行");
}
```

## 错误类型

| 类型           | 意义                                                                                                                                |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| ReferenceError | 当一个不存在（或尚未初始化）的变量被引用时发生的错误。                                                                              |
| SyntaxError    | 尝试解析不符合语法的代码的错误。当 Javascript 引擎解析代码时，遇到了不符合语法规范的标记（token）或标记顺序，则会抛出 SyntaxError。 |
| RangeError     | 试图将一个值作为参数传递给一个允许的范围不包含该值的函数会引发                                                                      |
| TypeError      | 通常（但并不只是）用来表示值的类型非预期类型时发生的错误。                                                                          |
