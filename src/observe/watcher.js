import Dep, { popTarget, pushTarget } from "./dep.js";
let id = 0;
class Watcher {
  constructor(vm, fn, option) {
    this.vm = vm;
    this.id = id++;
    this.getter = fn;
    this.renderWatcher = option; //如果为true，就是渲染watcher
    this.deps = [];
    this.depsId = new Set();
    if (option && option.lazy) {
      this.dirty = option.lazy;
      this.lazy = option.lazy;
    }
    this.value = this.lazy ? undefined : this.get();
  }
  evaluate() {
    this.value = this.get();
    this.dirty = false; //第一次初始化computed的时候，会去初始化computed的值，然后等依赖的值发生变化才会重新获取新值
  }
  get() {
    pushTarget(this);
    //每次渲染前，让dep.target为当前watcher实例，然render函数中读取的属性都收集当前watcher实例
    // set的时候更新执行这个watcher的方法
    const value = this.getter.call(this.vm);
    popTarget();
    // 收集完后清空dep.target
    return value;
  }
  addDep(dep) {
    let id = dep.id;
    // 首先是一次更新中，会可能多次访问到一个属性，不能每次访问到这个属性，把同样的watcher添加进去
    // 一个属性可能会对应多个watcher，也就是对应多个组件，一个watcher也会对应多个属性

    // 1、当某个响应式属性触发了get,会触发dep上的append,在去调用当前Dep类上的target上的watcher去进行双向添加
    // 2、先往当前的watcher上保存dep，往depsID去对dep去重
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this);
    }
  }
  /**
   * 让计算属性 watcher 中的所有 dep 与上一层 watcher 如渲染 watcher 互相记住
   */
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend(); // 让计算属性 watcher 中的所有 dep 重新去收集当前的 Dep.target watcher
    }
  }

  update() {
    // 当属性触发set时，会循环当前dep依赖的watcher执行 //所以当有computedWatcher时，计算属性就需要重新计算值
    if (this.lazy) {
      this.dirty = true; // 计算属性依赖的值发生变化后，计算属性就需要重新计算值 //触发重新更新模版，然后使用模版上出发到computedWatcher的get，重新调用evaluate
    } else {
      queueWatcher(this); // 不是计算 watcher 就将 watcher 缓存到队列中等待异步更新渲染
    }
  }
  run() {
    this.value = this.get();
  }
}
let has = {};
let queue = [];
let pending = false;
function flushSchedulerQueue() {
  let flushQueue = queue.slice(0);
  queue = [];
  has = {};
  pending = false;

  flushQueue.forEach((watcher) => watcher.run());
}
function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    // 在一轮响应式数据修改中，watcher只需要执行一次就行了
    queue.push(watcher);
    has[id] = true;
    // 当当前没有正在执行的更新队列时，就执行更新队列，否则就push到队列中，等待上一轮更新完成后执行，同时有新的数据修改时，就执行更新队列
    if (!pending) {
      pending = true;

      nextTick(flushSchedulerQueue);
    }
  }
}
let callbacks = [];
let waiting = false;
function flushCallbacks() {
  let cbs = callbacks.slice(0);
  waiting = false;
  callbacks = [];
  cbs.forEach((fn) => fn());
  console.log("更新了");
}
export function nextTick(fn) {
  // 把任务push到队列中 ，修改waiting的状态，不去重复创建异步任务，
  // 当上一个任务还没执行完，往队列中push新的任务，会在上一个任务中去一次行完成
  callbacks.push(fn);
  if (!waiting) {
    waiting = true;
    timeFunc(flushCallbacks);
  }
}

let timeFunc;
if (window.Promise) {
  timeFunc = () => {
    window.Promise.resolve().then(flushCallbacks);
  };
} else if (window.MutationObserver) {
  let observer = new MutationObserver(flushCallbacks);
  let textNode = document.createTextNode(1);
  observer.observe(textNode, {
    characterData: true,
  });
  timeFunc = () => {
    textNode.textContent = "2";
  };
} else {
  timeFunc = () => {
    setTimeout(flushCallbacks);
  };
}
export default Watcher;
