// @ts-nocheck
/**
 * 装饰器
 * 1.类（构造函数）
 * 2.属性（构造函数/原型对象，属性名）
 * 3.取值器（构造函数/原型对象，属性名，属性描述对象）
 * 4.方法（构造函数/原型对象，方法名，属性描述对象）
 * 5.参数（构造函数/原型对象，参数名，参数的索引）
 */
@toClass("Per")
class Per {
  @toProp()
  prop = 0;
  @toProp()
  static props = 12;
  @toFun()
  fun() {}
}
function toClass(str: string) {
  return (constructor: Function) => {
    constructor.prototype.name = str;
  };
}
function toProp() {
  return (obj: object, name: string) => {
    console.log("prop");
    console.log(obj, name);
  };
}
function toFun() {
  return (obj: object, name: string, descript: object) => {
    console.log("fun");
    console.log(obj, name, descript);
  };
}
