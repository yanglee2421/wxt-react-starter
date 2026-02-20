# npm

[npm](https://registry.npmjs.org)

## 全局配置

```powershell
npm config set registry https://registry.npm.taobao.org
npm config delete registry
```

## 初始化

```powershell
npm init
npm init -y
```

## 安装/卸载

```powershell
npm i
npm install -D
npm i -g
npm un
npm uninstall -g
```

## 发布

```powershell
#Login in npm
npm login
#Publish your package
npm publish --access public
```

## 查看包版本

```powershell
npm view package versions
npm list --depth 0
npm list -g --depth 0
```

## 清空缓存

```powershell
npm cache clean --force
```
