export default (paramData) => { // 获取时间所隔天数, 折线图假数据使用
    if (paramData.type) {
        switch (paramData.type) {
            case 'day':
                return 2;
            case 'week':
                return 6;
            case 'month':
                return 29;
        }
    }
    if (paramData.startDate && paramData.endDate) {
        return Math.round((paramData.endDate - paramData.startDate) / (3600 * 24 * 1000)) - 1;
    }
    return 6;
};
