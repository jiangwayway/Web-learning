# CSS注意事项

### 一、基础

#### 1.如果盒子本身没有指定width/height属性，则此时padding不会撑开盒子大小
如果盒子设置了width（设置width:100%也算设置了宽度），则再padding会将盒子撑大，如果没有设置width，则设置padding时盒子宽度不会发生改变

#### 2.相邻块元素垂直外边距的合并和嵌套块元素垂直外边距塌陷
对于相邻块元素，尽量只设置一个块元素的外边距；对于嵌套块元素，可以通过设置父元素上边框，父元素上内边距或者为父元素添加overflow:hidden实现

#### 3.设置浮动导致父各自高度塌陷的解决方式
方法：

(1) 额外标签法（在最后一个浮动标签后，新加一个标签，给其设置clear：both；）（不推荐）

(2) 父级添加overflow属性（父元素添加overflow:hidden）（不推荐）

(3) 使用after伪元素清除浮动（推荐使用）

(4) 使用before和after双伪元素清除浮动

#### 4.子盒子如果没有设置宽高，则默认宽度继承父盒子，高度为0;如果子盒子设置了浮动，则宽度不会继承，默认宽高都是0.

#### 5.`li` 与 `li` 之间有看不见的空白间隔是什么原因引起的？如何解决？如何隐藏`li`元素前面的小圆点？
有时候需要将`li`横排显示，这时候li是行内块元素，浏览器在渲染行内块元素的时候会将元素之间的空白字符（空格、换行、Tab等）渲染成一个空格。

解决方法：

通过css字符间隔属性`letter-spacing`消除`<li>`中空格符间隙，其中空格的默认间隙为8px，那么我们可以这样写：
```
.box ul{
	letter-spacing: -8px;   // 去除ul内的字符间距
}
.box li {
     width:25%; 
     height: 150px;
     display: inline-block;
     letter-spacing: normal;  // 并且将Li标签的字符间隔设为正常
}

//去除小圆点
ul li {
  ist-sytle: none
  或者
  list-style-type: none
}
```

#### 6. link和@import的区别

#### 7.隐藏元素的方法有哪些

#### 8.margin 和 padding 的使用场景
- 需要在border外侧添加空白，且空白处不需要背景（色）时，使用 margin；
- 需要在border内测添加空白，且空白处需要背景（色）时，使用 padding。

#### 9.单行、多行文本溢出隐藏
- 单行文本溢出
```
overflow: hidden;// 溢出隐藏
text-overflow: ellipsis;//溢出用省略号显示
white-space: nowrap;// 规定段落中的文本不进行换行
```
- 多行文本溢出
```
overflow: hidden;// 溢出隐藏
text-overflow: ellipsis;//溢出用省略号显示
display:-webkit-box;// 作为弹性伸缩盒子模型显示。
-webkit-box-orient:vertical;//设置伸缩盒子的子元素排列方式:从上到下垂直排列-webkit-line-clamp:3;// 显示的行数

```
