class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        this.key = key
        this.cb = cb

        // 把watcher对象记录到Dep类的静态属性target上
        Dep.target = this
        // 触发get方法， 在getter中调用 addSub
        this.oldValue = vm[key];

        Dep.target = null;
    }

    // 数据发生变化时更新视图
    update() {
        let newValue = this.vm[this.key]
        if (this.oldValue === newValue) {
            return
        }
        this.cb(newValue)
    }
}