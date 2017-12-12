export default (count) => {
    count = parseInt(count);
    if (count) {
        if (count < 10000) {
            return count;
        }
        if (count >= 10000 && count < 100000) {
            count = (count / 10000).toString().substr(0, 3) + '万';
            return count;
        }
        if (count >= 100000) {
            count = '10万+';
            return count;
        }
    }
    if (isNaN(count)) {
        return 0;
    }
    return count;
}
