export default (str) => {
    if (typeof str === 'string' && str.includes('{') && str.includes('}')) {
        let strObj = {};
        try {
            strObj = JSON.parse(str);
        } catch (e) {
            const strArr = str.replace(/[{}]/g, '').split(',');
            strArr.forEach(item => {
                const current = item.split(':');
                strObj[current[0]] = current[1];
            });
        }
        return strObj;
    } else {
        return str;
    }
}
