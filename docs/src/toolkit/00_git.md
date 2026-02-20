# Git

## Init

```powershell
git init
git clone https://github.com/yanglee2421/docs.git
```

## Config

```powershell
git config --global user.name "yanglee2421"
git config --global user.email "yanglee2421@gmail.com"
git config --global http.proxy http://127.0.0.1:7890
git config --list
```

## rm

```powershell
# 仅删除工作区-不暂存
rm filename
# 删除工作区-且暂存
git rm filename
# 强制删除工作区-且暂存
git rm -f filename
# 删除暂存区-且暂存
git rm -cached filename
```

## Commit

```powershell
git status
git add .
git commit -m 'commit msg'
```

## Tag

```powershell
git tag # List tags
git tag v0.0.1 # Add tag for current commit
git tag v0.0.2 55c524ddd473a9462bf244130d4c512301327469 # Add tag for the commit
git tag -d v0.0.2 # Delete tag
git push origin v0.0.1 # Push tag to remote
git push origin -d v0.0.1 # Delete tag in remote
```

## Log

```powershell
git log
git log -a --graph --abbrev-commit --pretty=oneline
git diff
git diff 55c524ddd473a9462bf244130d4c512301327469
git blame index.html
```

## Reset

```powershell
git checkout .
git reset
git reset --hard 55c524ddd473a9462bf244130d4c512301327469
git revert 55c524ddd473a9462bf244130d4c512301327469
```

## Branch

```powershell
git branch # list all local branch
git branch -r # list all remote branch in local
git branch -a # list all branch
git branch -vv # list all branch
git branch dev # Add branch that named dev
git branch -d dev # Delete branch that named dev
git branch -dr origin/dev # Delete remote branch that named dev in local
git branch --set-upstream-to=origin/dev
git checkout dev
git checkout -b dev
```

## Merge

```powershell
git merge dev
git merge --abort
```

## Remote

```powershell
git remote
git remote -v
git remote add remoteName gitUrl
git remote remove remoteName
git remote rename prevName neoName

git fetch
git fetch remoteName

git pull
git pull remoteName branchName

git push
git push -u remoteName branchName
git push --set-upstream remoteName branchName
git push remoteName -d branchName
```

## SSH

```powershell
ssh-keygen -t ed25519 -f 'filename' -C 'yanglee2421@gmail.com'
ssh git@github.com
```
