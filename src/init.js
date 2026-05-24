import {initState} from "./initState.js";
import { compileToFunction } from './compile/index.js'
import {mountComponent} from "./lifecycle.js";
import { nextTick } from "./observe/watcher.js";

export function initMixin (Vue){

    Vue.prototype._init = function (options){
        // 将用户选项挂载到实例上
        const vm = this
        vm.$options = options
        initState(vm)
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

