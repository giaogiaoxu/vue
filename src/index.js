
import {initMixin} from './init.js'
import { initLifeCycle } from './lifecycle.js'
import {nextTick} from "./observe/watcher.js";

function Vue (options){
    this._init( options)
    Vue.prototype.$nextTick = nextTick
    console.log(Vue,'vue')

}
initMixin(Vue)
initLifeCycle(Vue)


export default  Vue