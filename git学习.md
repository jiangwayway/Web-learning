# git学习
![git思维导图](image/git学习.jpeg#pic_center =600x600)
### 1.操作命令
#### 拉取远程仓库的更新
```js
git pull（相当于git fetch+git merge）
```
#### 将内容添加到暂存区
```
git add .
```
#### 将暂存区中的内容推送到本地仓库
```
git commit -m ""
```
#### 将本地仓库中的内容推送到远程仓库(包括将本地的新建分支推送到远程库中)
```
git push <remote_name> <branch_name>
```
#### 拉取远程库中的所有分支到本地（远程库中新建分支，而本地没有显示时使用）
```
git fetch
```
#### 将本地仓库中的内容推送到远程仓库(包括将本地的新建分支推送到远程库中)
```
git push <remote_name> <branch_name>
```
### 2.查看命令

#### 查看分支
```
git branch
```
#### 查看工作目录和暂存区的状态
```
git status
```

