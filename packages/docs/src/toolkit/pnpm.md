# Pnpm

[docs](https://pnpm.io/zh/installation)

## Installation

Windows

```powershell
# run as admin
corepack enable
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

Linux

```bash
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=10.0.0 sh -
```

## Usage

```bash
pnpm init
pnpm i
pnpm add react
pnpm remove react
pnpm up
```

## Env

```bash
pnpm env use -g lts
pnpm env remove -g lts
pnpm env list
```
