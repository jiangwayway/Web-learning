# git学习

### 1.思维导图
#### (1)总览
![git思维导图](https://github.com/jiangwayway/Web-learning/blob/dev/image/git%E5%AD%A6%E4%B9%A0.jpeg?raw=true)

#### (2)团队协作流程图
![团队协作流程图](https://raw.githubusercontent.com/jiangwayway/Web-learning/refs/heads/dev/image/%E5%9B%A2%E9%98%9F%E5%90%88%E4%BD%9C%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

#### (3)跨团队协作流程图
![跨团队协作流程图](https://raw.githubusercontent.com/jiangwayway/Web-learning/refs/heads/dev/image/%E8%B7%A8%E5%9B%A2%E9%98%9F%E5%90%88%E4%BD%9C%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

### 2.操作命令
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
### 3.查看命令

#### 查看分支
```
git branch
```
#### 查看工作目录和暂存区的状态
```
git status
```

