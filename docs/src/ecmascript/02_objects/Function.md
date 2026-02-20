# Function

## 实例方法

- [bind](#bind)
- [call](#call)
- [apply](#apply)

## 案例

### bind

```js
function fun(param1, params2) {
  console.log(this, params);
}
const obj = {};
const fx = fun.bind(obj, "params1", "params2");
fx();
```

### call

```js
function fun(param1, params2) {
  console.log(this, params);
}
const obj = {};
fun.call(obj, "params1", "params2");
```

### apply

```js
function fun(param1, params2) {
  console.log(this, params);
}
const obj = {};
fun.apply(obj, ["params1", "params2"]);
```

## arguments

- 存放函数实参的类数组
- callee 属性指向函数本身

## Arrow Function

- 静态 this：this 永远指向创建它的作用域里的 this
- 没有 arguments：使用 restProps 替代 arguments
- 没有 constructor：不能被 new 关字键调用

## 适用场景

- 需要 this 指针 ？Function : Arrow Function
- 需要函数提升 ？Function : Arrow Function
