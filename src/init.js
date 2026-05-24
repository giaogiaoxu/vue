import {initState} from "./initState.js";
import { compileToFunction } from './compile/index.js'
import { callHook, mountComponent } from "./lifecycle"
import { mergeOptions } from "./utils"

export function initMixin (Vue){

    Vue.prototype._init = function (options){
        // 将用户选项挂载到实例上
        const vm = this
        vm.$options = options
        vm.$options = mergeOptions(Vue.options, options)
        callHook(vm, 'beforeCreate')  // 依次调用 beforeCreate 生命周期钩子
        initState(vm)
        callHook(vm, 'created')  // 依次调用 created 生命周期钩子
        if(options.el){
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        el = document.querySelector(el);
        let ops = vm.$options;
        if (!ops.render) {
            let template;
            if (!ops.template && el) {
                template = el.outerHTML
            }else {
              if(el){
                  template = ops.template
              }
            }
            if(template){
                ops.render = compileToFunction(template)
            }
        }

        mountComponent(vm,el)
    }

    console.log(Vue.prototype)
}

