# 条件分支语句

## switch

1. `switch` 的值只能是字面量
2. 由于会生成对照表`switch`在选项众多的场景下性能优于`if...else`

## 卫函数

```js
function fun() {
  if (i === 1) {
    return;
  }
  if (i === 2) {
    return;
  }
}
```
