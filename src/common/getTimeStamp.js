export default (time) => { // 日期字符串 或 数字 转时间戳
    if (time.toString().length < 8) {
        if (time) {
            return new Date().setHours(0, 0, 0, 0) - 3600 * 24 * 1000 * time;
        } else {
            return new Date().getTime();
        }
    } else {
        return new Date(time).getTime();
    }
};
