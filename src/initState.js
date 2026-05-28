import { observe } from "./observe/index.js";
import Watcher from "./observe/watcher.js";
import Dep from "./observe/dep.js";
import { nextTick } from "./observe/watcher";
export function initStateMixin(Vue) {
  Vue.prototype.$nextTick = nextTick;
  Vue.prototype.$watch = function (expOrfn, cb) {
    new Watcher(this, expOrfn, { user: true }, cb);
  };
}

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}
function initData(vm) {
  let data = vm.$options.data;
  data = typeof data === "function" ? data.call(vm) : data;
  vm._data = data;
  proxy(vm, "_data");
  observe(data);
}

function proxy(vm, source) {
  Object.keys(vm[source]).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key];
      },
      set(newValue) {
        vm[source][key] = newValue;
      },
    });
  });
}
function initWatch(vm) {
  const watch = vm.$options.watch;
  for (let key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      handler.forEach((h) => {
        createWatcher(vm, key, h);
      });
    } else {
      createWatcher(vm, key, handler);
    }
  }
}
function createWatcher(vm, key, handler) {
  if (typeof handler === "string") {
    // handler 是字符串时表明要用 methods 中的同名方法
    handler = vm[handler]; // methods 中的方法也会被挂载到 vm 上
  }
  return vm.$watch(key, handler);
}
function initComputed(vm) {
  const computed = vm.$options.computed;
  for (let key in computed) {
    const userDef = computed[key];
    let watchers = (vm._computedWatchers = {});
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    const watcher = new Watcher(vm, getter, { lazy: true });
    watchers[key] = watcher;
    defineComputed(vm, key, userDef);
  }
}
function defineComputed(vm, key, userDef) {
  Object.defineProperty(vm, key, {
    get: createComputedGetter(key),
    set: userDef.set || (() => {}),
  });
}
function createComputedGetter(key) {
  return function () {
    let watcher = this._computedWatchers[key];
    if (watcher.dirty) {
      //当dirty为true时，表明有依赖属性数据改变了，需要重新计算watcher.dirty
      watcher.evaluate();
    }
    if (Dep.target) {
      // 计算属性 watcher 出栈后，如果 Dep.target 还有值，就让计算属性中的数据 dep 收集上一层的 watcher 如渲染watcher
      watcher.depend();
    }
    return watcher.value;
  };
}
