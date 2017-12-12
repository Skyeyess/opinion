export default (tempData) => { // 获取图表tooltip模板
    let url = `${location.origin}${location.pathname}${location.search}#/chartDetail?`;
    Object.keys(tempData.urlData).forEach((key, index) => {
        if (tempData.urlData[key] || tempData.urlData[key] === 0 || tempData.urlData[key] === '') {
            if (index) {
                url += `&${key}=${tempData.urlData[key]}`;
            } else {
                url += `${key}=${tempData.urlData[key]}`;
            }
        }
    });
    if (!tempData.enable) {
        url = 'javascript:void(0)';
    }
    if (tempData.radar) {
        let ele = '';
        for (let i = 0; i < tempData.radar.value.length; i++) {
            ele += `<div>${tempData.radar.seriesName.split(',')[i]} : ${tempData.radar.value[i]}</div>`;
        }
        return `<a class="chart-tooltip" href="${url}">
                <div><span class="chart-tooltip-point" style="background-color: ${tempData.color}"></span>${tempData.title}</div>
                <span>${ele}</span>
                </a>`;
    }
    return `<a class="chart-tooltip" href="${url}">
            <div>${tempData.title}</div>
            <span class="chart-tooltip-point" style="background-color: ${tempData.color}"></span>
            <span>${tempData.content}</span>
            </a>`;
};
