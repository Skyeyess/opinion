export default (input, type) => {
    if (/[a-zA-Z\u4e00-\u9fa5]/.test(input) || (input !== 0 && !input)) {
        return input;
    }
    if (/^\d{8}$/.test(input)) {
        input = Number(`${input}00000`);
    }
    if (input.toString().includes('-')) {
        input = input.replace(/-/g, '/');
    };
    if (input.toString().includes('.')) {
        input = input.split(' ')[0];
    };
    let now = new Date(input);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    // let second = now.getSeconds();
    let monthCurrent = now.getMonth() + 1;
    let dateCurrent = now.getDate();
    month = month < 10 ? '0' + month : month;
    date = date < 10 ? '0' + date : date;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    switch (type) {
        case 'date':
            return `${year}-${month}-${date}`;
        case 'monthDate':
            return `${month}-${date}`;
        case 'month':
            return `${monthCurrent}-${dateCurrent}`;
        case 'time':
            return `${hour}:${minute}`;
        case 'datetime':
            return `${year}-${month}-${date} ${hour}:${minute}`;
        case 'simple':
            const space = new Date().getTime() - now.getTime();
            if (space < 60000) {
                return '刚刚';
            } else if (space < 3600000) {
                return `${Math.floor(space / 60000)}分钟前`;
            } else if (space < 86400000) {
                return `${Math.floor(space / 3600000)}小时前`;
            } else if (space < 2592000000) {
                return `${Math.floor(space / 86400000)}天前`;
            } else if (space < 31536000000) {
                return `${Math.floor(space / 2592000000)}月前`;
            } else {
                return `${Math.floor(space / 31536000000)}年前`;
            }
        default:
            return `${year}-${month}-${date}`;
    }
};
