export function createElementVnode(vm,tag,data,...children){
    if(data == null){
        data = {}
    }
    let key;
    if(data.key){
        key = data.key
    }
    delete data.key
    return vnode(vm,tag,key,data,children)


}
export function createTextVnode(vm, text){
    return vnode(vm,undefined,undefined,undefined,undefined,text)

}

function vnode(vm,tag,key,data,children,text){
        return {
            tag,
            key,
            data,
            children,
            text
        }
}
