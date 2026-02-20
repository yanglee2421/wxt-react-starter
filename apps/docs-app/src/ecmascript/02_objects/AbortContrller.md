# AbortController

## 中止 axios

```js
const controller = new AbortController();
const { signal } = controller;
axios({
  signal,
  url: "/bing",
});
axios.get("/bing", { signal });
axios.post("/bing", { signal });
controller.abort();
```

## 中止 fetch

```js
const controller = new AbortController();
const { signal } = controller;
fetch("/bing", { signal });
controller.abort();
```

## 中止 EventListencer

```js
const controller = new AbortController();
const { signal } = controller;
dom.addEvenetListencer(
  "tap",
  (event) => {
    event.preventDefault();
    event.stopPropagation();
  },
  { signal }
);
controller.abort();
```
