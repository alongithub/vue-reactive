class Compiler {
    constructor(vm) {
        this.el = vm.$el;
        this.vm = vm;
        this.compile(this.el);
    }

    // 编译模板，处理文本节点和元素节点
    compile(el) {
        // 模板的所有子节点，el.childNodes 是一个伪数组
        let childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                this.compileElement(node)
            }

            // 判断node 是否有子节点如果有，递归调用compile
            // 存在子节点且长度不为0
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    // 编译元素节点处理指令
    compileElement(node) {
        // 通过node.attributes 获取节点上的赋值的属性atrbutes，该属性是一个伪数组
        // 遍历节点的属性
        Array.from(node.attributes).forEach(attr => {
            // 判断是否是指令
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2)
                let key = attr.value; // v-text="msg" key = "msg"
                this.update(node, key, attrName)
            }
        })
        
    }

    update(node, key, attrName) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }

    // 处理 v-text 指令
    textUpdater(node, value, key) {
        node.textContent = value;
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }

    // v-model
    modelUpdater(node, value, key) {
        // v-model用在表单元素上，更新表单元素内容通过 node.value
        node.value = value;
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })

        // 实现双向绑定
        node.addEventListener('input', (e) => {
            this.vm[key] = node.value
        })
    }

    // 编译文本节点，处理差值表达式
    compileText(node) {
        // 判断文本内容是否是差值表达式,提取差值表达式中的变量名 {{msg}}
        let reg = /\{\{(.+?)\}\}/
        // 获取文本节点内容
        let value = node.textContent;
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
        
            // 创建watcher对象数据改变更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue;
            })
        }
    }

    // 判断属性是不是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }

    // 判断是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }

    // 判断是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}