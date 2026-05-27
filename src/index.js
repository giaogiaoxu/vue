import { initMixin } from "./init.js";
import { initLifeCycle } from "./lifecycle.js";
import { nextTick } from "./observe/watcher.js";
import Watcher from "./observe/watcher.js";
function Vue(options) {
  this._init(options);
}
Vue.prototype.$nextTick = nextTick;
Vue.prototype.$watch = function (expOrfn, cb) {
  new Watcher(this, expOrfn, { user: true }, cb);
};
initMixin(Vue);
initLifeCycle(Vue);

export default Vue;
