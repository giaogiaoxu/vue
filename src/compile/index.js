import {parseHtml} from './parase.js'

const ELEMENT_TYPE = 1
const TEXT_TYPE = 3
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function parseStyle(styleStr) {
    if (!styleStr) return '{}'
    const arr = styleStr.split(';').filter(Boolean)
    let str = ''
    for (const decl of arr) {
        const [key, val] = decl.split(':')
        if (key && val) {
            str += `${JSON.stringify(key.trim())}:${JSON.stringify(val.trim())},`
        }
    }
    return `{${str.slice(0, -1)}}`
}

function genProps(attrs) {
    if (!attrs || attrs.length === 0) return 'null'
    let attrsStr = ''
    let styleStr = ''
    for (const attr of attrs) {
        if (attr.name === 'style') {
            styleStr = `style:${parseStyle(attr.value)},`
        } else {
            const val = attr.value === true ? '""' : JSON.stringify(attr.value)
            attrsStr += `${JSON.stringify(attr.name)}:${val},`
        }
    }
    if (!attrsStr && !styleStr) return 'null'
    let result = '{'
    if (attrsStr) result += attrsStr.slice(0, -1)
    if (styleStr) {
        if (attrsStr) result += ','
        result += styleStr.slice(0, -1)
    }
    result += '}'
    return result
}

function genNode(node) {
    if (node.type === ELEMENT_TYPE) {
        const children = node.children.map(c => genNode(c)).join(',')
        const data = genProps(node.attrs)
        return children
            ? `_c('${node.tag}',${data},${children})`
            : `_c('${node.tag}',${data})`
    } else if (node.type === TEXT_TYPE) {
        const text = node.text
        let match, lastIndex = 0, tokens = []
        defaultTagRE.lastIndex = 0
        while (match = defaultTagRE.exec(text)) {
            if (match.index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, match.index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = defaultTagRE.lastIndex
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return tokens.length === 0
            ? `_v(${JSON.stringify(text)})`
            : `_v(${tokens.join('+')})`
    }
}


function generate(ast) {
    return genNode(ast)
}

export function compileToFunction(template) {
    console.log(template)
    const ast = parseHtml(template)

    let code = generate(ast)
    code= `with(this){return ${code}}`
    return  new Function(code)

}
