import constants from '../constants/content';
export default (key, value) => {
    if (!localStorage.userName) return;
    const logMap = constants.LOGMAP;
    let logJson = [];
    try {
        logJson = JSON.parse(localStorage.log)
    } catch (error) {
        console.log(error)
    } finally {
        const obj = {};
        if (/[a-zA-Z\u4e00-\u9fa5]/.test(key) && logMap[key]) {
            key = logMap[key];
        }
        obj[key] = value || new Date().getTime();
        logJson.push(obj);
        localStorage.log = JSON.stringify(logJson);
    }
};
