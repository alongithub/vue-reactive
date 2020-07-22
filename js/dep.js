class Dep {
    constructor(){
        this.subs = []
    }

    addSub(sub) {
        if(sub && sub.update) {
            this.subs.push(sub);
        }
    }

    // 发送通知
    notify () {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}