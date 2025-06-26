var Sesamecakeshop = {
  clienlist: {},/*缓存列表*/
  /**
   * 增加订阅者
   * @key {String} 类型
   * @fn {Function} 回掉函数
   * */
  addlisten: function (key, fn) {
    if (!this.clienlist[key]) {
      this.clienlist[key] = [];
    }
    this.clienlist[key].push(fn);
  },
  /**
   * 发布消息
   * */
  trigger: function () {
    var key = [].shift.call(arguments),//取出消息类型，等价于var key=arguments.shift();
      fns = this.clienlist[key];//取出该类型的对应的消息集合
    if (!fns || fns.length === 0) {
      return false;
    }
    console.log(arguments)
    for (var i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments);
    }
  },
  /**
   * 删除订阅
   * @key {String} 类型
   * @fn {Function} 回掉函数
   * */
  remove: function (key, fn) {
    var fns = this.clienlist[key];//取出该类型的对应的消息集合
    if (!fns) {//如果对应的key没有订阅直接返回
      return false;
    }
    if (!fn) {//如果没有传入具体的回掉，则表示需要取消所有订阅
      fns && (fns.length = 0);
    } else {
      for (var l = fns.length - 1; l >= 0; l--) {//遍历回掉函数列表
        if (fn === fns[l]) {
          fns.splice(l, 1);//删除订阅者的回掉
        }
      }
    }
  }
}

/*小明发布订阅*/
Sesamecakeshop.addlisten("焦糖", fn1 = function (price, taste) {
  console.log("小明发布的" + price + "元，" + taste + "味道的");
});
/*小龙发布订阅*/
Sesamecakeshop.addlisten("椒盐", function (price, taste) {
  console.log("小龙发布的" + price + "元，" + taste + "味道的");
});

Sesamecakeshop.trigger("椒盐", 10, "椒盐");

// Sesamecakeshop.remove("焦糖", fn1);//注意这里是按照地址引用的。如果传入匿名函数则删除不了        

Sesamecakeshop.trigger("焦糖", 40, "焦糖");