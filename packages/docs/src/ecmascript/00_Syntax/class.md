# 类

## 静态属性

```js
class Person {
  static name = "人";
  static callName = () => {
    // 这个this指向构造函数本身
    console.log(this.name);
  };
}
Person.name; //"人"
```

## 扩展

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  call() {}
}
class Man extends Person {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  callAge() {
    super.call();
  }
}
```

## 存取器、私有属性

```js
class Person {
  #name = "人";
  get name() {
    return this.#name;
  }
  set name(value) {
    this.#name = value;
  }
}
// 对象上的存取器
const obj = {
  get name() {
    return "";
  },
  set name(value) {},
};
```

## Mix-ins

::: code-group

```js [mixin.js]
var calculatorMixin = (Base) =>
  class extends Base {
    calc() {}
  };

var randomizerMixin = (Base) =>
  class extends Base {
    randomize() {}
  };
```

```js
class Foo {}
class Bar extends calculatorMixin(randomizerMixin(Foo)) {}
```

:::
