let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    Dep.target.addDep(this);
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((sub) => sub.update());
  }
}

Dep.target = null; // Dep.target 用于存放当前要收集的 watcher
const stack = []; // 用于存放 dep 要通知的 watcher 栈
/**
 * 将传入的 watcher 赋值给 Dep.target 作为当前 dep 要收集的 watcher，同时将 watcher 放入栈中等待 dep 通知
 * @param {Watcher} watcher 要收集和通知的 watcher
 */
export function pushTarget(watcher) {
  stack.push(watcher);
  Dep.target = watcher;
}
/**
 * 从栈中弹出最后一个 watcher，其实就是当前的 Dep.target
 * 然后重新将栈中最后一个赋值给 Dep.target，当数组为空时 Dep.target 就为 undefined
 */
export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}

export default Dep;
