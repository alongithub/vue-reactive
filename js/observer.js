class Observer {
    constructor(data) {
        this.walk(data)
    }

    walk(data) {
        // 判断data是否是对象
        if (!data || typeof data !== 'object') {
            return
        }
        // 遍历data对象的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })

    }

    defineReactive(obj, key, value) {
        // 如果值是对象，会把对象中的属性也转换成响应式数据
        this.walk(value);

        // 收集依赖发送通知
        let dep = new Dep();

        let that = this;
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)

                return value; // 这里不能反回obj[key],否则会引起堆栈溢出
            },
            set(newValue) {
                if (newValue === value) {
                    return 
                }
                // 必保环境扩展了value 的作用域
                value = newValue
                // 如果新赋值的属性值是一个对象，监听这个对象的属性转换为响应式数据
                that.walk(newValue);
                // 发送通知
                dep.notify()
            }
            
        })
    }
}