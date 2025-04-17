# ES6新特性

### 一、模块化语法

#### 1.具名导入与导出
```
a.js
方式一：分别导出
export const a = 1;
export function b() {
  xxxx
}
export const c = function() {
  xxxx
}
方式二：统一导出
const a = 1;
const b = function() {
  xxxx
}
export {
  a,
  b,
  c: "test"
}
--------------------------------
方式一：分别导入
import {a,b} from "a.js"
console.log(a)

方式二：统一导入
import * as Domo from "a.js"
console.log(Domo.a)

方式三：导入并导出
export {a,b} from "a.js"
export * as Domo from "a.js"
相当于
import {a,b} from "a.js"
export {a,b}
import * as Domo from "a.js"
export Domo
```

#### 2.匿名导入与导出
```
a.js
方式一：
const a = 1;
export default a;

方式二：
const b = function() {
  xxxx
}
export default b;

方式三：
export default function() {
  xxxx
};

方式四：
const a = 1;
const b = function() {
  xxxx
}
export default {
  a,
  b,
  c: "test"
};
--------------------------------
导入方式
import name from "a.js"  //name可以自己随意取名
console.log(name)
```


#### 3.全部导入
```
a.js

export const a = 1;
export const b = function() {
  xxxx
}
const c = 2;
const d = function() {
  xxxx
}
export default {
  c,
  d
};

--------------------------------
导入方式
import * as name from "a.js"  //name可以自己随意取名
console.log(name.a) //1
console.log(name.default.c) //2
```