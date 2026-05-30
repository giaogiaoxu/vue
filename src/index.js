import { initMixin } from "./init.js";
import { initLifeCycle } from "./lifecycle.js";
import { initStateMixin } from "./initState";
import { compileToFunction } from './compile/index.js'
import {createElm} from "./vnode/patch.js";
import {patch} from "./vnode/patch.js";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initLifeCycle(Vue);
initStateMixin(Vue);

const render1 = compileToFunction('<ul>' +
    '<li style="background-color:blue;" key="e">e</li>' +
    '<li style="background-color:blue;" key="d">d</li>' +
    '<li style="background-color:blue;" key="c">c</li>' +
    '<li style="background-color:blue;" key="b">b</li>' +
    '<li style="background-color:blue;" key="a">a</li>'+
    '</ul>')
let vm1 = new Vue({
    data:{
        name:'peter'
    }
})
const preVnode = render1.call(vm1)
let el = createElm(preVnode)
document.body.appendChild(el)


const render2 = compileToFunction('<ul>' +
    '<li style="background-color:blue;" key="f">f</li>'+
    '<li style="background-color:blue;" key="a">a</li>' +
    '<li style="background-color:blue;" key="b">b</li>' +
    '<li style="background-color:blue;" key="c">c</li>' +
    '<li style="background-color:blue;" key="d">d</li>' +
    '<li style="background-color:blue;" key="e">e</li>'+
   '</ul>')

let vm2 = new Vue({
    data:{
        name:'123'
    }
})
console.log(render2.call(vm2))
const nextVnode = render2.call(vm2)
console.log(nextVnode,'nextNode')
setTimeout(()=>{
  patch(preVnode,nextVnode)
},1000)
export default Vue;
