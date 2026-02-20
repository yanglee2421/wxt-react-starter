export class MyObject extends Object {
  constructor(sign: number) {
    const obj = super(sign);
    const obj2 = Object(sign);
    console.log(obj, obj2, obj === obj2);
  }
}

new MyObject(1);
