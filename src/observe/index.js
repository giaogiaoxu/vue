import { arrayMethods } from './array.js'
import Dep from './dep.js'
class Observer {
    constructor(data) {
        this.dep = new Dep()
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false,
        })
        if(Array.isArray(data)){
            data.__proto__ = arrayMethods
            this.observeArray(data)
        }else{
            this.wall(data)
        }
    }

    wall(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
    observeArray(data){
        data.forEach(item => observe(item))
    }
}
export function observe (data){

    if(typeof data !=='object' ||  data === null){
        return
    }
    if(data.__ob__ instanceof  Observer) return
    // 如果一个对象被劫持过了，那么就不需要再次被劫持了
    return new Observer(data)
}
function arrayDepend(value){
    for(let i = 0; i < value.length; i++){
        const current = value[i]
        current.__ob__ && current.__ob__.dep.depend()
        if(Array.isArray(current)){
            arrayDepend(current)
        }
    }
}
function defineReactive(data, key, value){

    const childOb =  observe(value)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get(){
           if(Dep.target){
               dep.depend()
               if(childOb.dep){
                   childOb.dep.depend()
               }
               if(Array.isArray(value)){

                   arrayDepend(value)
               }
           }
            return value
        },
        set(newValue){
            if(newValue === value) return
            observe(newValue)
            value = newValue
            dep.notify()
        }
    })
}
