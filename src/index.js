import { initMixin } from "./init.js";
import { initLifeCycle } from "./lifecycle.js";
import { initStateMixin } from "./initState";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initStateMixin(Vue);
initLifeCycle(Vue);

export default Vue;
