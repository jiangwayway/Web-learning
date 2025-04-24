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
    // __dirname：__dirname是nodejs的变量，代表当前文件的文件夹绝对路径，
    //path：文件输出目录，必须是绝对路径
    //path.resolve：返回一个绝对路径
    //__filename: 总是返回当前文件的绝对路径
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
  output: {
    publicPath：'/assets/'，
    //会在所有的引用资源前加上该前缀，比如比如url("img/image1.png")会被修改为url("/assets/img/image1.png")，优先级低于局部配置的publicPath属性。
    //在基于 html-webpack-plugin 进行 webpack build 时，会修改生成的 index.html 文件中的 script、link 等的引用路径，如原来的<script src="main.js"></script> 会被修改为 <script src="/static/main.js"></script>
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]', //默认为[hash].[ext]，可以省略下面的outputPath，简写为'images/[name].[hash].[ext]'
            outputPath: 'images/'， //设置资源放置路径，如不设置则默认直接放在dist文件夹下
            publicPath: '/assets/' //会修改所有使用该资源的url链接，在原url链接前加上/assets/，比如url("img/image1.png")会被修改为url("/assets/img/image1.png")
          }
        }
      }
    ]
  }
};

```

##### （2）url-loader
url-loader 的功能类似于 file-loader，但它提供了一个额外的功能：当图片文件较小时，通过设置limit属性url-loader 会将图片转为 Base64 格式的内联数据 URI 直接嵌入到打包后的 JavaScript 文件中，从而减少 HTTP 请求,如果不配置limit属性，则所有图片都会被编码为base64的形式。

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,  // 文件小于 8KB 时转换为 Base64
            name: '[name].[hash].[ext]',
            outputPath: 'images/'
          }
        }
      }
    ]
  }
};

```

##### （3）raw-loader
url-loader可以将文件内容导出为字符串，导出方式为js模块化导出，这样在其他文件中导入该字符串进行使用。

比如有一个这样的txt

```
this is a txt file
```

假如你把它当作js来用，import或者require进来的时候，执行this is a txt file这句js，肯定会报错。如果想正常使用，那么这个txt文件需要改成:

```
export default 'this is a txt file'
```

最后在要使用的地方进行引入就行了

```
import txt from '!!raw-loader!/public/test.txt'

console.log(txt);//this is a txt file
```

默认不用配置，但如果你使用的是 CommonJS模块语法。需要做如下配置：

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false, //不使用ES6模块化，使用commonjs模块化
            },
          },
        ],
      },
    ],
  },
};
```

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
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    // 所有使用type: "asset"处理的静态文件打包后的路径及文件名（默认是走全局的，如果有独立的设置就按照自己独立的设置来。）
    assetModuleFilename: "assets/[name]_[hash][ext]",
    publicPath：'/assets/'，//使用与webpack4一致，Webpack 会将所有资源的加载路径都从该路径开始，比如为index.html中引入的<script> <link>等标签中的资源路径添加前缀，CSS文件中url路径前添加前缀等
  },
  module: {
    rules: [
      {
        // 用来匹配图片文件。
        test: /\.(png|jpe?g|gif|webp)$/,
        exclude: /node_modules/ //排除node_modules文件夹
        include: /node_modules/ //只会匹配node_modules文件夹的资源，与exclude二选一
        type: "asset", //类似于webpakc4中的url-loader+limit,如果不配置图片大小限制，默认是限制大小是8k
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片会被base64处理，好处是可以减少http请求，缺点是会增大图片尺寸。
          },
        },
        generator: {
          filename: "images/[hash:10][ext]", // 指定打包路径和文件名，优先级高于assetModuleFilename
          publicPath：'/assets/'，//使用与webpack4一致，在所有使用该资源的url地址前新增公共路径
        },
      },
    ]
  },
};
```

Webpack 5 中的三种 PublicPath 类型

- output.publicPath ：适用于所有输出文件，包括 JavaScript、CSS 和图像。

- module.rules[].generator.publicPath ：覆盖特定加载器或插件生成的输出文件的 URL 前缀。

- devServer ：指定开发服务器上提供文件的 URL 前缀。

### 四、处理字体图标以及其他资源


### 五、处理js资源

#### 1.Eslint
检测代码格式

#### 2.babel
处理react，vue，es6等，将其转化为es5，使其能在低版本浏览器中运行

### 六、处理html资源
将所有的打包资源通过link引入到html中

### 七、搭建开发服务器

### 八、开发模式和生产模式配置区别
原来webpack.config.js配置文件在项目根目录，后面为了区分开发与生产的配置文件，创建了文件夹config，把开发和生产的文件分开了放进去，为啥配置里面的相对路径不变，绝对路径要加个../呢？

个人认为应该是因为这是配置文件，项目打包时肯定是在根目录运行的，通过在命令行中使用`webpakc --config ./config/webpakc.config.js` 打包项目，打包的时候读取config文件夹下的配置文件，`相当于在命令行中将配置文件中的每个配置项拿出来放到命令行中`，比如说配置文件中的`mode: 'development',entry: './src/main.js'`配置项就可能变成`webpakc --entry ./src/main.js --mode development`的类似形式，所以此时配置项中的相对路径就是相对于执行打包命令的目录来说的，而不是配置文件所在的目录。

### 九、提取单独CSS文件
解决闪屏现象，出现闪屏现象的原因的css样式是通过js语言在html中生成style标签使用的，而浏览器在解析html标签时遇到script标签会先下载js代码再运行js代码，阻塞html解析，在这个过程中浏览器只会显示已经解析的html标签，没有样式，当js代码下载运行完了才会在html中新增style标签，之后浏览器中的元素才会有样式，这就是闪屏现象，如果单独提取css文件在html中通过link引入，就会一边解析html标签（构建DOM树），一边解析css样式（构建CSSOM树），一边渲染元素（通过DOM树和CSSOM树构建渲染树）。这样就不会出现闪屏现象了

白屏现象出现的原因是与上面类似，html中的结构都是通过js生成的，索引刚打开网页的时候浏览器要下载解析js，要是js代码很多，就会出现白屏现象

### 十、处理CSS兼容性

https://caniuse.com/