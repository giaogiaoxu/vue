
export function patch(oldVnode, vnode) {
    const isRealElement = oldVnode.nodeType;
    if (isRealElement) {
        const newElm = createElm(vnode);
        const parentElm = oldVnode.parentNode;
        parentElm.insertBefore(newElm, oldVnode.nextSibling);
        parentElm.removeChild(oldVnode);
    } else {
        console.log('更新视图',oldVnode, vnode,)
       patchVnode(oldVnode, vnode)
    }

    return vnode;
}
export function createElm(vnode) {
    if (vnode.tag) {
        vnode.el = document.createElement(vnode.tag);
        patchProps(vnode.el, {},vnode.data);
        vnode.children.forEach((child) => {
            vnode.el.appendChild(createElm(child));
        });
    } else {
        vnode.el = document.createTextNode(vnode.text);
    }
    return vnode.el;
}
export function patchProps(el,oldProps={}, props={}) {
    let oldStyles = oldProps.style||{}
    let newStyles = props.style||{}
    // 旧样式有，新样式没有，则删除
    for(let key in oldStyles){
        if(!newStyles[key]){
            el.style[key] = ''
        }
    }
    // 旧属性有，新属性没有，则删除
    for(let key in oldProps){
        if (!props[key]) {
            el.removeAttribute(key);
        }
    }
    // 旧属性有新属性也有，新属性覆盖旧属性
    // 旧属性没有，新属性有，则添加
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
function patchVnode(oldVnode, vnode){
    if(!isSameNode(oldVnode, vnode)){
        // 如果两个虚拟节点的类型不相同，直接用新节点覆盖掉老节点
        const newElm = createElm(vnode)
        oldVnode.el.parentNode.replaceChild(newElm, oldVnode.el)
        return newElm
    }
    let el = vnode.el = oldVnode.el
    if(el.tag === undefined){
        if(oldVnode.text !== vnode.text){
            el.textContent = vnode.text
        }
    }
    patchProps(el, oldVnode.data,vnode.data)
    // 比较儿子节点，老的有，新的没有。新的有，老的没有
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    if(oldChildren.length > 0 && newChildren.length > 0){
        // 需要进行diff对比
        updateChildren(el , oldChildren, newChildren)
    }else if(oldChildren.length > 0){
        el.interHtml = ''
    }else if(newChildren.length > 0){
      mountChildren(el, newChildren)

    }
    return el
}
function isSameNode(oldVnode, vnode){
    return oldVnode.tag === vnode.tag && oldVnode.key === vnode.key
}

function updateChildren(el, oldChildren, newChildren){
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[oldStartIndex]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]
    let newStartIndex = 0
    let newEndIndex = newChildren.length - 1
    let newStartVnode = newChildren[newStartIndex]
    let newEndVnode = newChildren[newEndIndex]
    function makeIndexByKey (children) {
        const map = {}
        children.forEach((child, index) => {
            map[child.key] = index
        })
        return map
    }
    const map = makeIndexByKey(oldChildren)

    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
    // 双方指针有一方大于尾部，就停止循环
        if(isSameNode(oldStartVnode, newStartVnode)){
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        }else if(isSameNode(oldEndVnode, newEndVnode)){
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]

        }else if(isSameNode(oldStartVnode, newEndVnode)){
            patchVnode(oldStartVnode, newEndVnode)
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        }else if(isSameNode(oldEndVnode, newStartVnode)){
            patchVnode(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        }else{

        }
    }
    if (newStartIndex <= newEndIndex) {  // 插入新数组头尾指针间的节点，例如 push 以及 unshift 情况
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            const childEl = createElm(newChildren[i])
            // 如果新数组的尾指针下一个有值，证明是从后向前比，例如 unshift 情况
            // 如果新数组的尾指针下一个没有值，证明是从前向后比，例如 push 情况
            const anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null
            el.insertBefore(childEl, anchor)
        }
    }
    if(oldStartIndex <= oldEndIndex){

        for(let i = oldStartIndex; i <= oldEndIndex; i++){
            if(oldChildren[i]){
                console.log(oldChildren[i])
                const childEl = createElm(oldChildren[i])
                oldChildren.el.parentNode.removeChild(childEl)
            }
        }
    }
}
function mountChildren(el, children){
    for(let i =0; i < children.length; i++){
        el.appendChild(createElm(children[i]))
    }
}