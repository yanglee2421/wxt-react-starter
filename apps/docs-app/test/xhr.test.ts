// 挂载 params & query 参数
const params_xhr = "params_xhr";
const url_xhr = new URL(`/bing/${params_xhr}`, "http://127.0.0.1");
url_xhr.searchParams.set("key", "value");
const xhr = new XMLHttpRequest();
xhr.open("GET", url_xhr);
// 配置 headers
xhr.setRequestHeader(
  "Authorizition",
  `Bearer ${localStorage.getItem("token")}`
);
xhr.onload = () => {
  if (xhr.status > 199 && xhr.status < 300) {
    console.log(xhr.response);
  }
};
// 挂载 body 参数并发送
const body_xhr = JSON.stringify({});
xhr.send(body_xhr);
xhr.abort();
