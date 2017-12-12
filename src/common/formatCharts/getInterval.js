export default (len) => { // 获取折线图必显示首尾日期的interval方法
    if (!len) {
        return 'auto';
    }
    let interval = [];
    if (len > 7) {
        [7, 6, 5, 4, 3, 2].forEach(item => {
            if (!((len - item) / (item - 1)).toString().includes('.')) {
                interval.push((len - item) / (item - 1));
            }
        });
        if (interval.length) {
            return interval[0];
        } else {
            return 'auto';
        }
    } else {
        return 0;
    }
};
