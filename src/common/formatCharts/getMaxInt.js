export default (numArr) => { // 获取数组最大值并转换为尾数为0的整数
    if (!numArr.length) {
        return 10;
    }
    let maxNum = Math.max.apply(null, numArr);
    if (maxNum < 100) {
        if (maxNum % 10 !== 0) {
            if (maxNum >= 0) {
                maxNum = maxNum + 10 - maxNum % 10;
            } else {
                maxNum = maxNum - 10 - maxNum % 10;
            }
        };
    } else {
        if (maxNum % 100 !== 0) {
            if (maxNum >= 0) {
                maxNum = maxNum + 100 - maxNum % 100;
            } else {
                maxNum = maxNum - 100 - maxNum % 100;
            }
        }
    }
    return maxNum;
}
