# webpack简介


### 一、配置文件

wbepack.config.js配置文件详解

作用：指示 webpack 干那些活(当你运行 webpack 指令时, 会加载里面的配置)

注意：

- 我们创建的src文件是我们写项目的源代码，用的是ES6模块化。
- ​所有构建工具都是基于node.js平台运行的，所以wbepack.config.js配置文件也是运行在nodejs中的，默认用的是commonjs。


```
const path = require('path'); //nodejs核心模块，专门用来处理路径问题

module.exports = {
  // 定义入口文件
  entry: './src/index.js', //相对路径

  // 定义输出
  output: {
    // __dirname是nodejs的变量，代表当前文件的文件夹目录，输出目录为当前目录下的 dist 文件夹
    path: path.resolve(__dirname, 'dist'),
    // 输出文件名为 main.js
    filename: 'main.js'
  },

  // 定义模式：开发模式或生产模式，开发模式下仅会编译ES6模块化语法，不会编译ES6的箭头函数等，而生产模式下还会做一些压缩和优化。
  mode: 'development',

  // 定义模块处理规则,loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块
  module: {
    rules: [
      //loader的配置
      {
        test: /\.css$/, // 处理 CSS 文件，只检测.css文件
        use: [
          //执行顺序，从右往左，从下往上,类似链式调用，只会输出最终结果
          'style-loader', 
          'css-loader'
        ],
        options: {
          // 可配置的参数，例如是否开启 CSS 模块化等
           modules: true
        }
        //简写模式：
        //loader: "style-loader!css-loader?modules"
        //!感叹号是分割符，表示两个工具都参与处理。
        //?问号，其实跟url的问号一样，就是后面要跟参数的意思。
        //loader和use的区别是loader中只能写一个loader，比如loader："xxxxx",而use中可以写多个loader

        //完整模式：
        //use: [
        //  { loader: 'style-loader' },
        //  {
        //    loader: 'css-loader',
        //    options: {
        //      modules: true
        //    }
        //  }

      },
      
      {
        test: /\.(png|svg|jpg|gif)$/, // 处理图片文件
        use: [
          'file-loader'
        ]
      }
    ]
  },

  // 定义插件
  plugins: [
    // 自动生成 HTML 文件并注入资源
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

```




### 二、loader配置

#### 1.css-loader
主要负责解析CSS文件内部的依赖结构，并将CSS模块转化为js模块。

##### （1）解析CSS模块依赖关系

css-loader 的首要任务是深度解析 CSS 文件内部的依赖结构。

在 CSS 规范中，@import 规则允许引入外部 CSS 文件，而 url() 函数则用于引用诸如背景图片、字体文件等外部资源。css-loader 能够遍历 CSS 文件的语法树，精准识别这些依赖声明，并将被引用的外部 CSS 文件内容整合到当前处理的模块中。

例如，考虑一个具有多层嵌套 @import 的 CSS 结构：

```
@import "base.css";
@import "layout.css";
.container {
  background-image: url('bg-image.png');
  font-family: 'CustomFont', sans-serif;
}
```

其中 base.css 和 layout.css 可能又各自包含其他的依赖或样式规则。css-loader 会递归地解析这些文件，构建起一个完整的样式依赖图谱，确保所有相关的样式信息都被正确收集和处理。

##### (2)将 CSS 转换为 JavaScript 模块
在解析完依赖关系后，css-loader 会将整个 CSS 模块（包括自身及其所有依赖的样式）转换为 JavaScript 模块。这一转换过程并非简单的字符串拼接，而是遵循特定的模块规范，使得在 JavaScript 环境中能够像处理普通模块一样对待 CSS。具体而言，css-loader 会将 CSS 样式规则转换为 JavaScript 对象，其中每个样式规则的选择器作为对象的属性，对应的样式声明则作为属性值。例如，对于上述的 .container 规则，可能会被转换为类似以下的 JavaScript 对象形式：

```
{
  ".container": {
    "background-image": "url('bg-image.png')",
    "font-family": "'CustomFont', sans-serif"
  }
}
```

当设置 modules: true 时，css-loader 还会为 CSS 类名添加唯一的哈希值，以实现 CSS 模块化，避免全局样式冲突。这在大型项目中，多个组件或模块共享样式时尤为重要。

#### 2.style-loader
主要负责创建`<style>`标签，并将css-loader转化后的CSS内容设置为标签的内容，之后将`<style>`标签插入到html页面的`<head>`标签内部。

##### （1）动态创建 `<style>` 标签

`style-loader` 的核心功能是将 `CSS` 样式注入到 `HTML` 页面中，使其能够被浏览器解析和应用。它通过在 `JavaScript` 运行时动态创建 `<style>` 标签来实现这一目的。当 `Webpack` 构建项目并执行到 `style-loader` 处理的 CSS 模块时，`style-loader` 会获取由 `css-loader` 转换后的 CSS 内容（通常是 JavaScript 模块中的字符串形式），然后创建一个新的 `<style>` 元素，并将 CSS 内容设置为该元素的 `textContent`。

例如：

```
// 堆代码 duidaima.com
// 假设 cssContent 是 css-loader 处理后的 CSS 字符串
const styleElement = document.createElement('style');
styleElement.textContent = cssContent;
```

##### (2)插入 `<style>` 标签到 `HTML` 页面
在创建完 `<style>` 标签并填充 CSS 内容后，`style-loader` 会将该标签插入到 HTML 页面的合适位置，通常是 `<head>` 元素内部。这样，浏览器在渲染页面时就能够识别并应用这些样式。`document.head.appendChild(styleElement);`通过这种方式，`style-loader` 确保了 CSS 样式能够及时生效，并且在页面的生命周期内保持可用。

```
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .container {
      background-image: url('bg-image.png');
      font-family: 'CustomFont', sans-serif;
    }
  </style>
</head>

```