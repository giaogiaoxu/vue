import {observe} from './observe/index.js'
export function initState(vm){
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
}
function initData(vm) {
    let data = vm.$options.data
    data = typeof data === 'function' ? data.call(vm) : data
    vm._data = data
    proxy(vm, '_data')
    observe(data)

}
function proxy(vm, source){
    Object.keys(vm[source]).forEach(key => {
        Object.defineProperty(vm, key, {
            get(){
                return vm[source][key]
            },
            set(newValue){
                vm[source][key] = newValue
            }
        })
    })
}
