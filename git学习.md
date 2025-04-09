# git学习

### 1.思维导图
#### (1)总览
![git思维导图](https://github.com/jiangwayway/Web-learning/blob/dev/image/git%E5%AD%A6%E4%B9%A0.jpeg?raw=true)

#### (2)团队协作流程图
![团队协作流程图](https://raw.githubusercontent.com/jiangwayway/Web-learning/refs/heads/dev/image/%E5%9B%A2%E9%98%9F%E5%90%88%E4%BD%9C%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

#### (3)跨团队协作流程图
![跨团队协作流程图](https://raw.githubusercontent.com/jiangwayway/Web-learning/refs/heads/dev/image/%E8%B7%A8%E5%9B%A2%E9%98%9F%E5%90%88%E4%BD%9C%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

### 2.本地库操作
#### 查看工作区和暂存区的状态(是否有文件修改未提交)
```
git status
```
#### 比较工作区和暂存区的差异(具体内容的修改)
```
git diff 文件名 //-红色代表修改前，+绿色代表修改后，diff –git a/文件名1 b/文件名2代表比较的文件是文件1和文件2，index 1234567..890abc1 100644代表两个文件的索引，最后的数字是文件权限，--- a/文件1，+++ b/文件2代表修改前的文件是文件1，修改后的文件是文件2，@@ -start,n +start,n @@代表修改的内容范围是修改前文件的-start行开始的n行和修改后文件的+start行开始的n行，接下来是修改前的内容和修改后的内容。
```
#### 比较工作区和本地库的差异(同上)
```
git diff 索引 文件名
```
#### 查看历史版本
```
git reflog
```
#### 前进或后退历史版本
```
git reset --hard 索引值 //--soft仅重置本地库指针，--mixed重置本地库指针和暂存区，--hard重置本地库指针，暂存区和工作区
```
#### 撤销工作区的修改
```
git checkout .
git checkout -- 文件名 //撤销单个文件的修改 
```
#### 撤销工作区和暂存区的修改
```
git checkout -f //所有文件
或者
git reset HEAD //所有文件
git reset HEAD 文件名 //单个文件 
```
#### 将内容添加到暂存区
```
git add .
```
#### 将暂存区中的内容推送到本地仓库
```
git commit -m ""
```
#### 查看或设置全局用户名(去掉""就是查看)
```
git config --global user.name ""
```
#### 查看或设置全局邮箱
```
git config --global user.email ""
```

### 3.远程库操作
#### 克隆远程库到本地（自动为远程库起别名为origin）
```
git clone <url> //默认克隆的是master分支
git clone -b 分支名 <url> //指定克隆的分支
```
#### 远程库起别名(为了方便对远程库操作，一般给远程库起别名而不是直接用url地址)
```
git remote -v //查看所有的远程库地址和别名
git remote add 别名 远程库地址
```
#### 拉取远程仓库的更新
```
git pull 远程库 分支名
相当于：
git fetch 远程库 分支名
git merge 远程库/分支名
```
#### 将本地仓库中的内容推送到远程仓库(包括将本地的新建分支推送到远程库中)
```
git push 远程库 分支名
```
### 4.分支操作
#### 查看分支
```
git branch
git branch -vv //查看本地分支和远程分支的关联情况
git branch -a //查看所有分支，包括远程分支和本地分支
```
#### 更新远程库中的分支（远程库中新建分支，而本地没有显示时使用）
```
git fetch
```
#### 新建分支
```
git branch 分支名 //本地分支
git push 远程库 分支名 //新建远程分支
```
#### 删除分支
```
git branch -d 本地分支 //如果该分支对应了远程库的分支，且修改后未提交，可能删除失败，可以使用-D强制删除
git push 远程库 --delete 远程分支 //删除远程分支
```
#### 切换分支
```
git checkout 分支名 //切换本地分支
git checkout 远程库/分支名 //切换远程分支
```
#### 将本地分支关联到远程分支
```
git branch --set-upstream-to=远程库/分支名
```
#### 新建本地分支的同时关联远程分支
```
git checkout -b 本地分支 origin/远程分支 
相当于：
git checkout -b 本地分支
git branch --set-upstream-to=远程库/分支名
相当于：
git branch 本地分支
git checkout 本地分支
git branch --set-upstream-to=远程库/分支名
```
#### 分支合并
```
git merge 分支名 //合并本地分支
git merge 远程库/远程分支 //合并远程分支，在合并之前需要使用"git fetch 远程库 分支名"命令将远程分支拉取到本地
```
### 5.分页器操作
#### 退出查看：字母q
#### 向下翻一页：空格
#### 向上翻一页：字母b
#### 向下翻半页：字母d
#### 向上翻半页：字母u
#### 向下翻一行：字母j
#### 向上翻一行：字母k
#### 跳到第一行：字母g
#### 跳到最后一行：字母G
#### 跳到第n行：ng

### 6.git提交规范
#### 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
```
git commit -m "build: 提示消息"
```
#### 新功能
```
git commit -m "feat: 提示消息"
```
#### 修改bug
```
git commit -m "fix: 提示消息"
```
#### 文档修改
```
git commit -m "docs: 提示消息"
```
#### 优化相关，比如提升性能、体验
```
git commit -m "perf: 提示消息"
```
#### 测试用例修改
```
git commit -m "test: 提示消息"
```
#### 代码格式修改, 注意不是 css 修改
```
git commit -m "style: 提示消息"
```
#### 重构
```
git commit -m "refactor: 提示消息"
```
#### 代码回滚
```
git commit -m "revert: 提示消息"
```
#### 持续集成修改
```
git commit -m "ci: 提示消息"
```
#### 配置修改
```
git commit -m "config: 提示消息"
```
#### 其他改动
```
git commit -m "chore: 提示消息"
```