# fetch

## 使用

```ts
// 处理 params & query 参数
const params = "list";
const url = new URL(`/api/joke/${params}`, "https://autumnfish.cn");
url.searchParams.set("num", "1");
// 处理 body 参数
const body = JSON.stringify({});
// 处理 headers 配置
const headers = new Headers();
headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);
headers.set("Content-Type", "application/json;charset=utf-8");
// 发请求
fetch(url, {
  method: "post",
  body,
  headers,
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });
```
