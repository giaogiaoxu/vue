let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype)
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        oldArrayPrototype[method].call(this, ...args)
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2)
                break;
        }
        if (inserted) {
            this.__ob__.observeArray(inserted)
        }
    this.__ob__.dep.notify()
    }
})
