# Yang_Lee Docs

## create-app

[![version](https://img.shields.io/badge/version-0.0.15-blue)](https://www.npmjs.com/package/@yanglee2421/create-app?activeTab=readme)
![pnpm](https://img.shields.io/badge/pnpm-latest-orange)
![dependencies](https://img.shields.io/badge/dependencies-vite-brightgreen)
![developer](https://img.shields.io/badge/developer-YangLee-f39f37)

## Usage

With NPM

```bash
npm create @yanglee2421/app
```

With Yarn

```bash
yarn create @yanglee2421/app
```

With PNPM

```bash
pnpm create @yanglee2421/app
```

## set up

```bash
pnpm add -D vitepress vue
mkdir docs
cd docs
# desktop/my-docs/docs
new-item index.md
cd ../
# desktop/my-docs
pnpm exec vitepress dev docs
```

## cli

```bash
vitepress dev docs
vitepress build docs
vitepress preview docs
```

## config

```bash
# root-dir/docs
cd .vitepress
# root-dir/docs/.vitepress
new-item config.ts
```

```ts
// config.ts
import { defineConfig } from "vitepress";
export default defineConfig({
  base: "/docs/",
  lang: "zh-CN",
  title: "Yang_Lee",
  head: [["link", { rel: "shortcut icon", href: "vite.svg" }]],
  themeConfig: {
    logo: "vite.svg",
    siteTitle: "Yang_Lee",
    socialLinks: [
      { icon: "github", link: "https://github.com/Swz0321" },
      { icon: "twitter", link: "..." },
      // You can also add custom icons by passing SVG as string:
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Dribbble</title><path d="M12...6.38z"/></svg>',
        },
        link: "...",
      },
    ],
    nav: [
      { text: "nav-1", link: "" },
      {
        text: "nav-2",
        items: [
          { text: "nav-2-1", items: [] },
          { text: "Item B", link: "/item-2" },
        ],
      },
    ],
    sidebar: {
      "/": [
        {
          text: "TypeScript",
          collapsible: true,
          items: [{ text: "类型", link: "" }],
        },
      ],
      "/data/": [
        {
          text: "开始",
          collapsible: true,
          items: [
            {
              text: "Scss",
              items: [{ text: "注释", items: [] }],
            },
          ],
        },
      ],
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Yang_Lee：xtcff082421@gmail.com",
    },
  },
});
```

## 表情符

:tada:
:100:

## 卡片

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger STOP
Danger zone, do not proceed
:::

::: details Click me to view the code

```js
console.log("Hello, VitePress!");
```

:::

## Badge

### Title <Badge type="info" text="default" />

### Title <Badge type="tip" text="^1.9.0" />

### Title <Badge type="warning" text="beta" />

### Title <Badge type="danger" text="caution" />

## code

::: code-group

```ts [use.ts]
import {} from "vite"; // [!code --]
import {} from "vite"; // [!code ++]
import {} from "vite"; // [!code warning]
import {} from "vite"; // [!code error]
import {} from "vite"; // [!code focus]
import {} from "vite"; // [!code hl]
```

```ts{1,3-4}
export const a = "a";
export { a };
export default {};
export function useHook() {}
```

:::

```yml
theme: jekyll-theme-slate
include: [_plugin-vue_export-helper-c27b6911.js]
```

# Simple Newtab

## Installation

- [microsoft edge](https://microsoftedge.microsoft.com/addons/detail/simple-newtab/pmldkljjfgngoidjkbjjfnipaocgpdkh)
- [firefox](https://addons.mozilla.org/zh-CN/firefox/addon/simple-newtab/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)

## What is next

1. 时间显示增加秒显示
2. 纯色面板增加一些预置颜色
3. 图片面板的Trash高度改小
4. 恢复默认设置的按钮

### Statistics

统计项目文件数和代码行数（不包括 git 忽略的部分）：

```powershell
(git ls-files | ForEach-Object { (Get-Content $_ | Measure-Object -Line).Lines }) | Measure-Object -Sum
```

## 为 ADG 和 UBO 收集的一些拦截规则

![version](https://img.shields.io/badge/version-0.0.1-blue)
![npm](https://img.shields.io/badge/yan-v1.2.19-orange)
![dependencies](https://img.shields.io/badge/dependencies-express-brightgreen)
![developer](https://img.shields.io/badge/developer-YangLee-f39f37)

## 规则语法:

### 转义字符

| 字符     | 含义                                         |
| -------- | -------------------------------------------- |
| `*`      | 任意字符                                     |
| `\| \|`  | https:// 或者 http://                        |
| `/route` | 该路径下的所有文件（不包含子文件夹中的文件） |
| `^`      | `/` 或者 `:`也用来分隔域名结尾和`$`          |
| `$`      | 内容修饰符                                   |

### 内容修饰符用法

| 用法                  | 含义                   |
| --------------------- | ---------------------- |
| `$image`              | 拦截图片               |
| `$~image`             | 除了图片都拦截         |
| `$script`             | 拦截 script 标签       |
| `$~script`            | 除了 script 标签都拦截 |
| `$3p`                 | 拦截第三方请求         |
| `$domain=指定域名`    | 拦截来自指定域名的请求 |
| `$denyallow=指定域名` | 放行来自指定域名的请求 |

### 元素拦截

- 语法：域名`##`css 选择器

```
baidu.com##div
```

- 特殊伪类：`:contains()`

```css
/*
配匹`innerText`中含有指定内容的元素，建议配上子元素选择器和正则一起用
*/
div > div:contains(/要配匹的字符/)
```
