# webpack基础


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
    filename: 'main.js',
    clean: true, // 自动将上次打包目录资源清空
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




### 二、处理样式资源
为什么要处理样式以及其他资源？

因为webpack仅仅能将js中的ES6模块化语法转化为commonjs语法，并将转化后的js文件输出在dist文件夹中，要是不对其他资源进行处理，那么dist文件夹中就只有js文件，没有CSS文件和图片以及其他资源了，因此，webpack要对所有的静态资源进行处理，最起码要将静态资源复制到dist文件夹中并改变js或者css或者html中的url为复制到dist文件夹后的url地址（比如file-loader可以文件复制到dist文件夹中）。

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

#### 3.处理css资源

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, 
        use: [
          'style-loader', 
          'css-loader'
        ]
      },
    ]
  },
};
```
#### 4.处理less资源

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/, 
        use: [
          'style-loader', 
          'css-loader',
          'less-loader', //将less文件编译为css文件
        ]
      },
    ]
  },
};
```

#### 5.处理scss/sass资源

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/, 
        use: [
          'style-loader', 
          'css-loader',
          'sass-loader',//将sass文件编译为css文件
        ]
      },
    ]
  },
};
```

### 三、处理图片资源

文件指纹：指的是打包后输出的文件名和后缀

文件指纹可以由以下占位符组成：

- ext：原资源后缀名
- name：原文件名称
- path：原文件的相对路径
- folder：原文件所在的文件夹
- hash：每次webpack构建时生成一个唯一的hash值


#### 1.webpack4的处理方式


##### （1）file-loader
file-loader 会将图片文件打包到输出目录，并返回图片的 URL，开发者可以直接在 CSS 或 JavaScript 中引用图片。配置如下：

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]', //默认为[hash].[ext]，可以省略下面的outputPath，简写为'images/[name].[hash].[ext]'
            outputPath: 'images/' //默认直接放在dist文件夹下，局部设置资源放置路径，优先级高于全局设置
          }
        }
      }
    ]
  }
};

```

##### （2）url-loader

##### （3）raw-loader




#### 2.webpack5的处理方式

在 webpack5 之前，可能需要使用 raw-loader、file-loader、url-loader 来加载资源。

- raw-loader：将文件作为字符串导入
- file-loader：处理文件的路径并输出文件到输出目录
- url-loader：有条件将文件转化为 base64 URL，如果文件大于 limit 值，通常交给 file-loader 处理，如果没有设置limit值，默认全部按照base64打包。

在 webpack5+，以上方法已经过时了，webpack5 使用了“资源模块”来代替以上 loader。

资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。

资源模块的类型：
- asset/resource： 发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
- asset/inline： 导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
- asset/source： 导出资源的源代码。之前通过使用 `raw-loader` 实现。
- asset： 介于asset/resource和asset/inline之间，在导出一个资源data URI和发送一个单独的文件并导出URL之间做选择，之前通过`url-loader+limit`属性实现。

```
module.exports = {
  module: {
    rules: [
      {
        // 用来匹配图片文件。
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset", //类似于webpakc4中的url-loader+limit,如果不配置图片大小限制，默认是限制大小是8k
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片会被base64处理，好处是可以减少http请求，缺点是会增大图片尺寸。
          },
        },
        generator: {
          filename: "images/[hash:10][ext]", // 指定打包路径和文件名
        },
      },
    ]
  },
};
```