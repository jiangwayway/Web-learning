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

方式一：通过css字符间隔属性`letter-spacing`消除`<li>`中空格符间隙，其中空格的默认间隙为8px，那么我们可以这样写：

```less
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
  list-sytle: none;
  //或者
  list-style-type: none;
}
```

方式二：父元素设置font-size为0，子元素重新设置font-size为原来的大小。

注意：使用这种方式的时候，我发现父元素的高度会变化，比如原来设置了行高为30px，那么将font-size设置为0后，父元素的行高会变大，具体的原因我也没搞懂，解决的话将父元素的行高设置为0，子元素的行高设置为30px就可以解决了，好像是基线对齐的问题，网上有一篇[文章](https://www.mulingyuer.com/archives/124/#heading-1)有提到

```less
.box ul{
	font-size: 0;   // 将全部字符大小设置为0
}
.box li {
     width:25%; 
     height: 150px;
     display: inline-block;
     font-size: 12px;  // 将文字设置为正常大小
}
```

#### 6. link和@import的区别
CSS的三种使用方式分别是：
- 行内样式（内联样式）：直接在标签中通过style属性写样式
- 内部样式：将样式编写到head中的style标签里，然后通过CSS的选择器来选中元素并为其设置各种样式，可以同时为多个标签设置样式，并且修改时只需要修改一处即可。
- 外部样式：可以将CSS样式编写到一个外部的CSS文件中，然后通过link标签来引入外部的CSS文件。

其中外部样式有两种引入方式：
- link是XHTML标签，除了加载CSS外，还可以定义RSS等其他事务；@import属于CSS范畴，只能加载CSS。
- link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。

#### 7.隐藏元素的方法有哪些
- display: none：渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也不会响应绑定的监听事件。
- visibility: hidden：元素在页面中仍占据空间，但是不会响应绑定的监听事件。
- opacity: 0：将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。
- transform: scale(0,0)：将元素缩放为 0，来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。
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

```less
overflow: hidden;// 溢出隐藏
text-overflow: ellipsis;//溢出用省略号显示
display:-webkit-box;// 作为弹性伸缩盒子模型显示。
-webkit-box-orient:vertical;//设置伸缩盒子的子元素排列方式:从上到下垂直排列-webkit-line-clamp:3;// 显示的行数
```

#### 10.如何判断元素到达可视区域

#### 11.样式兼容
css3作为页面样式的表现语言，增加了很多新的属性，但是部分css3属性在一些浏览器上还处于试验阶段，所以为了有效的显示css3的样式，对应不同的浏览器内核需要不同的前缀声明，例如：

```
-moz- ：Firefox，GEcko引擎
-webkit-： Safari和Chrome，Webkit引擎
-o- ：Opera（早期），Presto引擎，后改为Webkit引擎
-ms- ：Internet Explorer，Trident引擎
```

使用这些前缀，才能保证css3的属性在特定浏览器渲染引擎下生效。统一引擎一般不识别其它引擎的前缀，目前移动端的浏览器相对比较统一，都是采用的webkit引擎，所以如果我们只需要兼容移动端，只需要带-webkit-前缀即可。

在使用css3新属性的时候，一般需要把带有前缀的属性放于前面，把不带前缀的版本放到最后一行：

```
1 -webkit-box-shadow: 0 5px 5px rgba(0, 0, 0, .5);
2 -moz-box-shadow: 0 5px 5px rgba(0, 0, 0, .5);
3 -o-box-shadow: 0 5px 5px rgba(0, 0, 0, .5);
4 box-shadow: 0 5px 5px rgba(0, 0, 0, .5);
```

随着浏览器的升级，目前大多数新版本浏览器都已经支持不带前缀的写法了，所以带前缀只是为了兼容低版本，不带前缀的才是标准属性。