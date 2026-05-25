(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  function _createForOfIteratorHelper(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length ? {
              done: true
            } : {
              done: false,
              value: r[n++]
            };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o,
      a = true,
      u = false;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return a = r.done, r;
      },
      e: function (r) {
        u = true, o = r;
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = true,
        o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = true, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  var oldArrayPrototype = Array.prototype;
  var arrayMethods = Object.create(oldArrayPrototype);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayPrototype$me;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args));
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      if (inserted) {
        this.__ob__.observeArray(inserted);
      }
      this.__ob__.dep.notify();
    };
  });

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = [];
    }
    return _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (sub) {
          return sub.update();
        });
      }
    }]);
  }();
  Dep.target = null; // Dep.target 用于存放当前要收集的 watcher
  var stack$1 = []; // 用于存放 dep 要通知的 watcher 栈
  /**
   * 将传入的 watcher 赋值给 Dep.target 作为当前 dep 要收集的 watcher，同时将 watcher 放入栈中等待 dep 通知
   * @param {Watcher} watcher 要收集和通知的 watcher
   */
  function pushTarget(watcher) {
    stack$1.push(watcher);
    Dep.target = watcher;
  }
  /**
   * 从栈中弹出最后一个 watcher，其实就是当前的 Dep.target
   * 然后重新将栈中最后一个赋值给 Dep.target，当数组为空时 Dep.target 就为 undefined
   */
  function popTarget() {
    stack$1.pop();
    Dep.target = stack$1[stack$1.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      this.dep = new Dep();
      Object.defineProperty(data, "__ob__", {
        value: this,
        enumerable: false
      });
      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
        this.observeArray(data);
      } else {
        this.wall(data);
      }
    }
    return _createClass(Observer, [{
      key: "wall",
      value: function wall(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);
  }();
  function observe(data) {
    if (_typeof(data) !== "object" || data === null) {
      return;
    }
    if (data.__ob__ instanceof Observer) return;
    // 如果一个对象被劫持过了，那么就不需要再次被劫持了
    return new Observer(data);
  }
  function arrayDepend(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();
      if (Array.isArray(current)) {
        arrayDepend(current);
      }
    }
  }
  function defineReactive(data, key, value) {
    var childOb = observe(value);
    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();
          if (childOb !== null && childOb !== void 0 && childOb.dep) {
            childOb.dep.depend();
          }
          if (Array.isArray(value)) {
            arrayDepend(value);
          }
        }
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue);
        value = newValue;
        dep.notify();
      }
    });
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, fn, option) {
      _classCallCheck(this, Watcher);
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
    return _createClass(Watcher, [{
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false; //第一次初始化computed的时候，会去初始化computed的值，然后等依赖的值发生变化才会重新获取新值
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this);
        //每次渲染前，让dep.target为当前watcher实例，然render函数中读取的属性都收集当前watcher实例
        // set的时候更新执行这个watcher的方法
        var value = this.getter.call(this.vm);
        popTarget();
        // 收集完后清空dep.target
        return value;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
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
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;
        while (i--) {
          this.deps[i].depend(); // 让计算属性 watcher 中的所有 dep 重新去收集当前的 Dep.target watcher
        }
      }
    }, {
      key: "update",
      value: function update() {
        // 当属性触发set时，会循环当前dep依赖的watcher执行 //所以当有computedWatcher时，计算属性就需要重新计算值
        if (this.lazy) {
          this.dirty = true; // 计算属性依赖的值发生变化后，计算属性就需要重新计算值 //触发重新更新模版，然后使用模版上出发到computedWatcher的get，重新调用evaluate
        } else {
          queueWatcher(this); // 不是计算 watcher 就将 watcher 缓存到队列中等待异步更新渲染
        }
      }
    }, {
      key: "run",
      value: function run() {
        this.value = this.get();
      }
    }]);
  }();
  var has = {};
  var queue = [];
  var pending = false;
  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(function (watcher) {
      return watcher.run();
    });
  }
  function queueWatcher(watcher) {
    var id = watcher.id;
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
  var callbacks = [];
  var waiting = false;
  function flushCallbacks() {
    var cbs = callbacks.slice(0);
    waiting = false;
    callbacks = [];
    cbs.forEach(function (fn) {
      return fn();
    });
    console.log("更新了");
  }
  function nextTick(fn) {
    // 把任务push到队列中 ，修改waiting的状态，不去重复创建异步任务，
    // 当上一个任务还没执行完，往队列中push新的任务，会在上一个任务中去一次行完成
    callbacks.push(fn);
    if (!waiting) {
      waiting = true;
      timeFunc(flushCallbacks);
    }
  }
  var timeFunc;
  if (window.Promise) {
    timeFunc = function timeFunc() {
      window.Promise.resolve().then(flushCallbacks);
    };
  } else if (window.MutationObserver) {
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observer.observe(textNode, {
      characterData: true
    });
    timeFunc = function timeFunc() {
      textNode.textContent = "2";
    };
  } else {
    timeFunc = function timeFunc() {
      setTimeout(flushCallbacks);
    };
  }

  function initState(vm) {
    var opts = vm.$options;
    if (opts.data) {
      initData(vm);
    }
    if (opts.computed) {
      initComputed(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === "function" ? data.call(vm) : data;
    vm._data = data;
    proxy(vm, "_data");
    observe(data);
  }
  function proxy(vm, source) {
    Object.keys(vm[source]).forEach(function (key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[source][key];
        },
        set: function set(newValue) {
          vm[source][key] = newValue;
        }
      });
    });
  }
  function initComputed(vm) {
    var computed = vm.$options.computed;
    for (var key in computed) {
      var userDef = computed[key];
      var watchers = vm._computedWatchers = {};
      var getter = typeof userDef === "function" ? userDef : userDef.get;
      var watcher = new Watcher(vm, getter, {
        lazy: true
      });
      watchers[key] = watcher;
      defineComputed(vm, key, userDef);
    }
  }
  function defineComputed(vm, key, userDef) {
    Object.defineProperty(vm, key, {
      get: createComputedGetter(key),
      set: userDef.set || function () {}
    });
  }
  function createComputedGetter(key) {
    return function () {
      var watcher = this._computedWatchers[key];
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

  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(unicodeRegExp.source, "]*");
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <asd:asd>
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名
  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ELEMENT_TYPE$1 = 1;
  var TEXT_TYPE$1 = 3;
  var stack = [];
  var currentParent;
  var root;
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE$1,
      children: [],
      attrs: attrs,
      parent: null
    };
  }
  function parseHtml(html) {
    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);
      if (!root) {
        root = element;
      }
      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
      stack.push(element);
      currentParent = element;
    }
    function end(tagName) {
      stack.pop();
      currentParent = stack[stack.length - 1];
    }
    function chars(text) {
      text = text.replace(/\s/g, '');
      text && currentParent.children.push({
        type: TEXT_TYPE$1,
        text: text
      });
    }
    function advance(len) {
      html = html.substring(len);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        var _end, attr;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
          advance(attr[0].length);
        }
        if (_end) {
          advance(_end[0].length);
        }
        return match;
      }
      return false;
    }
    while (html) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        var startTagMatch = parseStartTag(); //匹配开始标签
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          end(endTagMatch.tagName);
          advance(endTagMatch[0].length);
          continue;
        }
      }
      if (textEnd > 0) {
        var text = html.substring(0, textEnd);
        chars(text);
        if (text) {
          advance(text.length);
        }
      } else if (textEnd < 0) {
        chars(html);
        advance(html.length);
      }
    }
    return root;
  }

  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function parseStyle(styleStr) {
    if (!styleStr) return '{}';
    var arr = styleStr.split(';').filter(Boolean);
    var str = '';
    var _iterator = _createForOfIteratorHelper(arr),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var decl = _step.value;
        var _decl$split = decl.split(':'),
          _decl$split2 = _slicedToArray(_decl$split, 2),
          key = _decl$split2[0],
          val = _decl$split2[1];
        if (key && val) {
          str += "".concat(JSON.stringify(key.trim()), ":").concat(JSON.stringify(val.trim()), ",");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  function genProps(attrs) {
    if (!attrs || attrs.length === 0) return 'null';
    var attrsStr = '';
    var styleStr = '';
    var _iterator2 = _createForOfIteratorHelper(attrs),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var attr = _step2.value;
        if (attr.name === 'style') {
          styleStr = "style:".concat(parseStyle(attr.value), ",");
        } else {
          var val = attr.value === true ? '""' : JSON.stringify(attr.value);
          attrsStr += "".concat(JSON.stringify(attr.name), ":").concat(val, ",");
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (!attrsStr && !styleStr) return 'null';
    var result = '{';
    if (attrsStr) result += attrsStr.slice(0, -1);
    if (styleStr) {
      if (attrsStr) result += ',';
      result += styleStr.slice(0, -1);
    }
    result += '}';
    return result;
  }
  function genNode(node) {
    if (node.type === ELEMENT_TYPE) {
      var children = node.children.map(function (c) {
        return genNode(c);
      }).join(',');
      var data = genProps(node.attrs);
      return children ? "_c('".concat(node.tag, "',").concat(data, ",").concat(children, ")") : "_c('".concat(node.tag, "',").concat(data, ")");
    } else if (node.type === TEXT_TYPE) {
      var text = node.text;
      var match,
        lastIndex = 0,
        tokens = [];
      defaultTagRE.lastIndex = 0;
      while (match = defaultTagRE.exec(text)) {
        if (match.index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, match.index)));
        }
        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = defaultTagRE.lastIndex;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return tokens.length === 0 ? "_v(".concat(JSON.stringify(text), ")") : "_v(".concat(tokens.join('+'), ")");
    }
  }
  function generate(ast) {
    return genNode(ast);
  }
  function compileToFunction(template) {
    var ast = parseHtml(template);
    var code = generate(ast);
    code = "with(this){return ".concat(code, "}");
    return new Function(code);
  }

  function createElementVnode(vm, tag, data) {
    if (data == null) {
      data = {};
    }
    var key;
    if (data.key) {
      key = data.key;
    }
    delete data.key;
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, key, data, children);
  }
  function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function vnode(vm, tag, key, data, children, text) {
    return {
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  function patch(oldVnode, vnode) {
    var isRealElement = oldVnode.nodeType;
    if (isRealElement) {
      var newElm = createElm(vnode);
      var parentElm = oldVnode.parentNode;
      parentElm.insertBefore(newElm, oldVnode.nextSibling);
      parentElm.removeChild(oldVnode);
    } else {
      // 更新对比
      var _newElm = createElm(vnode);
      var _parentElm = oldVnode.el.parentNode;
      _parentElm.insertBefore(_newElm, oldVnode.nextSibling);
      _parentElm.removeChild(oldVnode.el);
    }
    return vnode;
  }
  function createElm(vnode) {
    if (vnode.tag) {
      vnode.el = document.createElement(vnode.tag);
      patchProps(vnode.el, vnode.data);
      vnode.children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(vnode.text);
    }
    return vnode.el;
  }
  function patchProps(el, props) {
    console.log(props);
    for (var key in props) {
      if (key === "style") {
        for (var _key in props.style) {
          el.style[_key] = props.style[_key];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }
  function initLifeCycle(Vue) {
    Vue.prototype._c = function () {
      return createElementVnode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
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
      var vm = this;
      return vm.$options.render.call(vm);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;
    new Watcher(vm, function () {
      vm._update(vm._render());
    }, true);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 将用户选项挂载到实例上
      var vm = this;
      vm.$options = options;
      initState(vm);
      if (options.el) {
        vm.$mount(options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var ops = vm.$options;
      if (!ops.render) {
        var template;
        if (!ops.template && el) {
          template = el.outerHTML;
        } else {
          if (el) {
            template = ops.template;
          }
        }
        if (template) {
          ops.render = compileToFunction(template);
        }
      }
      mountComponent(vm, el);
    };
  }

  function Vue(options) {
    this._init(options);
    Vue.prototype.$nextTick = nextTick;
    console.log(Vue, 'vue');
  }
  initMixin(Vue);
  initLifeCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
