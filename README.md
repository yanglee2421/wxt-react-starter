# @Yang_Lee

## create-app

[![version](https://img.shields.io/badge/version-0.0.15-blue)](https://www.npmjs.com/package/@yanglee2421/create-app?activeTab=readme)
![pnpm](https://img.shields.io/badge/pnpm-latest-orange)
![dependencies](https://img.shields.io/badge/dependencies-vite-brightgreen)
![developer](https://img.shields.io/badge/developer-YangLee-f39f37)

### Usage

With PNPM

```bash
pnpm create @yanglee2421/app
```

## Newtab

### Installation

- [microsoft edge](https://microsoftedge.microsoft.com/addons/detail/simple-newtab/pmldkljjfgngoidjkbjjfnipaocgpdkh)
- [firefox](https://addons.mozilla.org/zh-CN/firefox/addon/simple-newtab/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)

### What is next

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
