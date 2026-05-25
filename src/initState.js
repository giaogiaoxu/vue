import { observe } from "./observe/index.js";
import Watcher from "./observe/watcher.js";
import Dep from "./observe/dep.js";
export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
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
