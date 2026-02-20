# Promise

## 构造器

```js
const promise = new Promise((resolve, reject) => {
  if (true) {
    resolve(res);
  } else {
    reject(err);
  }
});
```

## 静态方法

### `resolve(any)`

```js
// 返回一个状态为 resolve 的 promise
const promise = Promise.resolve("成功时的结果");
```

### `reject(any)`

```js
// 返回一个状态为 reject 的 promise
const promise = Promise.reject("拒绝时的结果");
```

### `all(promise[])`

```js
// 全为 resolve 时，才返回 resolve
Promise.all([promise0, promise1])
  .then(([res0, res1]) => {})
  .catch()
  .finally();
```

### `allSettled(promise[])`

```js
// 全部敲定时，返回所有敲定的结果
Promise.allSettled([promise0, promise1])
  .then(([res0, res1]) => {})
  .catch()
  .finally();
```

### `any(promise[])`

```js
// 任意一个为 resolve 时， 返回该promise的结果
Promise.any([promise0, promise1])
  .then((res) => {})
  .catch()
  .finally();
```

### `race(promise[])`

```js
// 任意一个敲定时，返回该 promise 的结果
Promise.race([promise0, promise1])
  .then((res) => {})
  .catch()
  .finally();
```

## 实例方法

### `then(callback,callback)`

```js
const p = new Promise((resolve, reject) => {
  true ? resolve("result") : reject("reason");
});
p.then(
  (result) => {
    console.log("敲定为resolve时，将此回调推入微任务队列");
  },
  (reasion) => {}
    console.log("敲定为reject时，将此回调推入微任务队列");
);
/**
 * promise的状态决定then中的哪个回调会被执行
 * then里的回调的返回值决定then的promise的状态
 */
```

### `catch(callback(reject))`

```js
// then的一种简写
Promise.reject("err").then(null, callback);
Promise.reject("err").catch((reason) => {
  console.log("promise被敲定为reject时，将callback推入微任务队列");
});
```

### `finally(callback)`

```js
/**
 * promise被敲定（无论为resolve或reject）时，
 * 将回调推入微任务队列
 * 接收不到 result 和 reason
 */
Promise.resolve().then().catch().finally();
```

## async、await

### async

> 将此函数的返回值包装为 promise，并开启 await 关键字

### await

> 将所在函数的分成两段，await 以左视为同步进程， await 右侧的 promise 敲定时，将 await 以下的部分推入微任务队列

```js
async function fun() {
  console.log("同步");
  const res = await Promise.resolve();
  return res;
}
```
