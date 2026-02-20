# yarn

yarn是一个由Meta（原Facebook）开发的npm包管理工具（package manager）。yarn使用的依赖关系算法相比npm有一定优势，其主要体现在安装依赖的速度更快。但必须承认的是，随着npm版本的不断迭代，两者的差距越来越小了。

## Installation

```powershell
# 启用corepack中的yarn
corepack enable
# 可以根据需要切换yarn的版本
corepack prepare yarn@stable --activate
corepack prepare yarn@1 --activate
# 也可以使用npm全局安装yarn
npm i -g yarn
```

__NOTE：__ 使用 corepack 启用 yarn 需要在以管理员权限启动 powershell

## Config

```powershell
# 配置/恢复npm镜像
yarn config set registry https://registry.npm.taobao.org
yarn config delete registry
# 配置http/https代理
yarn config set proxy http://127.0.0.1:7890
yarn config delete proxy
yarn config set https-proxy https://xxx.com
yarn config delete https-proxy
# 列出所有配置
yarn config list
```

## Init

```powershell
# 初始化npm包
yarn init
# 以默认配置初始化npm包
yarn init -y
```

## Dependencies

```powershell
# 安装所有依赖，并生成.lock文件
yarn
# 添加依赖
yarn add
# 添加开发依赖
yarn add -D
# 移除依赖
yarn remove
# 升级依赖
yarn upgrade
# 列出依赖
yarn list package --depth 0
```

## Global

```powershell
# 返回全局依赖的bin目录
yarn global bin
# 返回yarn的根路径
yarn global root
# 添加全局依赖
yarn global add
# 移除全局依赖
yarn global remove
# 列出全局依赖
yarn global list --depth 0
```

__NOTE：__ 不配置 bin 路径，yarn 全局安装的包无法使用

## Run

~~~powershell
# 使用yarn执行package.json中的script
yarn dev
yarn build
yarn run dev
yarn run build
# 使用yarn执行当前项目中的cli命令（tsx为例）
yarn tsx xxx.ts
# 使用yarn执行js
yarn node xxx.js
~~~

## V3

yarn的v3版本太过于超前了（完全放弃了node_modules），目前并不推荐使用。

相比于yarn@1，yarn@3的主要区别在于：

1. 下载的依赖以压缩包形式存在，因此体积比原来的node_modules小得多。
2. 开始支持dlx命令（类似npx），可以直接执行npm上的bin命令。
3. 执行项目中的js脚本必须使用yarn node，因为npm无法读取压缩包形式的依赖。
4. TypeScript支持较差。

```powershell
# 使用yarn3来初始化一个项目
yarn init -2
# typescript无法识别yarn3依赖类型的问题
# 1. VScode安装ZipFS插件
# 2. 执行以下命令
yarn dlx @yarnpkg/sdks vscode
```
