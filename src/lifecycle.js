import { createElementVnode, createTextVnode } from "./vnode/index.js";
import Watcher from "./observe/watcher.js";
function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    const newElm = createElm(vnode);
    const parentElm = oldVnode.parentNode;
    parentElm.insertBefore(newElm, oldVnode.nextSibling);
    parentElm.removeChild(oldVnode);
  } else {
    const newElm = createElm(vnode);
    const parentElm = oldVnode.el.parentNode;
    parentElm.insertBefore(newElm, oldVnode.nextSibling);
    parentElm.removeChild(oldVnode.el);
  }

  return vnode;
}
function createElm(vnode) {
  if (vnode.tag) {
    vnode.el = document.createElement(vnode.tag);
    patchProps(vnode.el, vnode.data);
    vnode.children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(vnode.text);
  }
  return vnode.el;
}
function patchProps(el, props) {
  for (let key in props) {
    if (key === "style") {
      for (let key in props.style) {
        el.style[key] = props.style[key];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}
export function initLifeCycle(Vue) {
  Vue.prototype._c = function () {
    return createElementVnode(this, ...arguments);
  };
  Vue.prototype._v = function (text) {
    return createTextVnode(this, text);
  };
  Vue.prototype._s = function (value) {
    if (typeof value === "string") return value;
    return JSON.stringify(value);
  };
  Vue.prototype._update = function (vnode) {
    this.$el = patch(this.$el, vnode);
  };
  Vue.prototype._render = function () {
    let vm = this;
    return vm.$options.render.call(vm);
  };
}

export function mountComponent(vm, el) {
  vm.$el = el;
  new Watcher(
    vm,
    () => {
      vm._update(vm._render());
    },
    true,
  );
}
