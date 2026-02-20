// @ts-nocheck
import { createServer } from "node:http";
const server = createServer((request, response) => {
  const str = request.url?.replace(/^[\/]{1}[\?]?/g, "");
  const obj = new URLSearchParams(str);
  console.log(obj.keys());
  //encode(); //请求方的地址
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end("<h1>会话结束，告辞！</h1>");
});
/**
 * 80：http服务的默信端口
 * 443：https服务的默认端口
 * 22：SSH服务的默认端口
 * 53：DNS服务的默认端口
 */
server.listen(443, () => {
  console.log("待机中。。。");
});
