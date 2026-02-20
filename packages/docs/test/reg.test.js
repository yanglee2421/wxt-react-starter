const reg = /^\/(?!api\/).*/s;

console.log(reg.test("/"));
console.log(reg.test("/api/1222"));
console.log(reg.test("/xxxxxx"));

const reg0 = /(?<=front)qq(?!back)/;

console.log(reg0.test("xqqx"));
console.log(reg0.test("qqa"));
console.log(reg0.test("qq"));
// 匹配test，test前必是front，test后必是back
/(?<=front)test(?=back)/;
// 匹配test，test前不是front，test后不是back
/(?<!front)test(?!back)/;
