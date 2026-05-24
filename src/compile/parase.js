const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <asd:asd>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const comment = /^<!--/;
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const conditionalComment = /^<!\[/;

const ELEMENT_TYPE = 1
const TEXT_TYPE = 3
const stack =[]
let currentParent;
let root;
function createASTElement(tagName,attrs){
    return {
        tag:tagName,
        type:ELEMENT_TYPE,
        children:[],
        attrs,
        parent:null
    }
}
export function parseHtml( html){
    function start(tagName,attrs){
        let element = createASTElement(tagName,attrs)
        if(!root){
            root = element
        }
        if(currentParent){
            element.parent = currentParent
            currentParent.children.push(element)
        }
        stack.push(element)
        currentParent = element
    }
    function end(tagName){
        stack.pop()
        currentParent = stack[stack.length-1]
    }
    function chars(text){
        text = text.replace(/\s/g,'')
        text && currentParent.children.push({
            type: TEXT_TYPE,
            text
        })
    }
    function advance(len){
        html = html.substring(len)
    }
    function parseStartTag(){
        const start = html.match(startTagOpen);
        if(start){
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length);

            let end,attr;

            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
                match.attrs.push({name:attr[1],value:attr[3] || attr[4] || attr[5] || true})
                advance(attr[0].length)
            }
            if(end){
                advance(end[0].length)


            }
            return match
        }
        return false
    }
    while (html){
        let textEnd = html.indexOf('<');
        if(textEnd === 0){
            const startTagMatch =  parseStartTag() //匹配开始标签
            if(startTagMatch){
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue
            }
            let endTagMatch = html.match(endTag);
            if(endTagMatch){
                end(endTagMatch.tagName)

                advance(endTagMatch[0].length)

                continue
            }
        }
        if(textEnd > 0){
            const text = html.substring(0,textEnd)
            chars(text)
            if(text){
                advance(text.length)
            }
        } else if(textEnd < 0){
            chars(html)
            advance(html.length)
        }

    }
    return root
}
