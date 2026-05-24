
import { initGlobalAPI } from "./globalAPI"
import { initMixin } from "./init"
import { initLifeCycle } from "./lifecycle"
import { nextTick } from "./observe/watcher"

function Vue (options){
    this._init( options)
    Vue.prototype.$nextTick = nextTick
    console.log(Vue,'vue')

}
initMixin(Vue)
initLifeCycle(Vue)
initGlobalAPI(Vue)


export default  Vue