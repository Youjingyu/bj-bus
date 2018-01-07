const htmlparser = require("htmlparser");

module.exports = {
    dom: function(string){
        const result = [];
        string.match(/<option.*?<\/option>/g)
            .forEach(ele => {
                result.push({
                    value: ele.match(/value="(.*?)"/)[1],
                    text: ele.match(/>(.*?)</)[1]
                });
        });
        return result;
    },
    domText: function(htmlString){
        let html = '';
        const handler = new htmlparser.DefaultHandler(function(error, dom){
            if(!error){
                dom.forEach(ele => {
                    if(ele.attribs.class === 'inquiry_header'){
                        html = parseTree(ele.children);
                    }
                });
            }
        });
        const parser = new htmlparser.Parser(handler);
        parser.parseComplete(htmlString);
        return html.replace(/&nbsp;/g, '  ');
    }
}

function parseTree(dom){
    let text = '';
    dom.forEach(ele => {
        if(ele.type === 'text'){
            text += ele.data + '<br/>'
        }
        if(ele.children){
            text += parseTree(ele.children);
        }
    });
    return text;
}