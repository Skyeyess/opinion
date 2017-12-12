export default (content, cutLength, symbol, highlight) => { // content: 要截取的内容， cutLength： 截取长度，symbol：截取后内容尾部要添加的符号，highlight：要高亮的文本
    if (!content || !/^[0-9]*$/.test(cutLength)) { // content不存在或cutLenth不是数字时直接return
        return content;
    };

    let len = 0;
    const beforeContent = content;
    if (symbol !== false) { // 当字符为false时不处理
        for (let i = 0; i < cutLength; i++) { // 英文字符时每两个增加一个截取长度
            if (/[\x00-\xff]/.test(content[i])) {
                len += 1;
                if (len === 2) {
                    cutLength += 1;
                    len = 0;
                }
            }
        }
    }

    content = content.substring(0, cutLength); // 截取字符串

    if (highlight) { // 高亮文本
        highlight = highlight.replace(/[-_,!|~`()#$%^&*{}:;"L<>?.]/g, '');
        highlight.split(' ').forEach(item => {
            if (item) {
                content = content.replace(new RegExp(item, 'g'), `<b>${item}</b>`)
            }
        });
    }

    if (beforeContent.length > cutLength && symbol !== false) { // 内容尾部添加符号
        content = `${content}${symbol || '…'}`;
    }

    return content;
};
