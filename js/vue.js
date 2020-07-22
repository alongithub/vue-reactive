class Vue {
    constructor(options) {
        // 保存参数
        this.$options = options || {}
        this.$data = this.$options.data || {}
        this.$el = typeof this.$options.el === 'string' ? document.querySelector(this.$options.el) : this.$options.el
        // 把data中的参数转换成getter和setter
        this._proxyData(this.$data)
        // 调用Observer对象监听数据的变化
        new Observer(this.$data);
        // 调用Compiler解析指令和差值表达式 
        new Compiler(this)
    }

    _proxyData(data) {
        // 遍历data中的属性，把data中的属性注入到vue实例中
        Object.keys(data).forEach(key => {
            Object.defineProperty(this/* this就是vue实例 */, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (newValue === data[key]) {
                        return
                    }
                    data[key] = newValue;
                }
            })
        })

    }
}