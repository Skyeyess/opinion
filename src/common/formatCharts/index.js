import chart from '../../constants/chart';
import getInterval from './getInterval';
import getDay from './getDay';
import getTooltip from './getTooltip';
import getMaxInt from './getMaxInt';

export default (that, result, paramData, stateData) => { // that: 当前vue实例 result: 接口返回数据, stateData: 该对象含有type和formatter两个属性
    if (!stateData || !stateData.type) return;
    switch (stateData.type) {
        case 'line':
            let lineOption = chart.chartLine; // 图表静态option
            let timestamp = [];
            lineOption.xAxis.data = [];
            lineOption.series[0].data = [];
            Object.keys(result).forEach(key => { // 有数据时数据处理
                if (/^-[1-9]\d*$/.test(key)) return;
                if (/^[0-9]*$/.test(key)) {
                    timestamp.push(`${key}00000`);
                } else {
                    timestamp.push(that.getTimeStamp(key));
                }
                lineOption.xAxis.data.push(that.dateFormat(key, 'month'));
                lineOption.series[0].data.push(result[key]);
            });
            if (!Object.keys(result).length) { // 无数据时生成假数据
                for (let i = getDay(paramData); i >= 0; i--) {
                    timestamp.push(that.getTimeStamp(i));
                    lineOption.xAxis.data.push(that.dateFormat(that.getTimeStamp(i), 'month'));
                    lineOption.series[0].data.push(0);
                }
            }
            lineOption.xAxis.axisLabel.interval = getInterval(lineOption.xAxis.data.length);
            lineOption.tooltip.formatter = function (params) { // 自定义formatter
                const tempData = {
                    enable: stateData.formatter,
                    urlData: {
                        currentDate: timestamp[params[0].dataIndex],
                        keyword: paramData.topicId
                    },
                    color: '#4e87f9',
                    title: params[0].name,
                    content: `${params[0].seriesName} : ${params[0].value}`
                };
                return getTooltip(tempData);
            }
            return lineOption;
        case 'bar':
            let barOption = chart.chartBar;
            const barKeyArr = [];
            barOption.xAxis[0].data = [];
            barOption.series[0].data = [];
            if (typeof result === 'string') {
                result = that.strToObj(result);
            }
            Object.keys(result).forEach((key, index) => {
                // if (barOption.series[0].data.length > 11) return;
                if (key) {
                    barKeyArr.push(key);
                    barOption.xAxis[0].data.push(that.filterCharacter(key, 8));
                    barOption.series[0].data.push(result[key]);
                }
            });
            if (!Object.keys(result).length) {
                barOption.xAxis[0].data = chart.barStaticData.data;
                barOption.series[0].data = new Array(barOption.xAxis[0].data.length).fill(0);
            }
            barOption.tooltip.formatter = function (params) {
                let company = params[0].name;
                barKeyArr.forEach(item => {
                    if (company === that.filterCharacter(item, 8)) {
                        company = encodeURIComponent(item);
                    }
                });
                const tempData = {
                    enable: stateData.formatter,
                    urlData: {
                        companyName: company,
                        type: paramData.type,
                        startDate: paramData.startDate,
                        endDate: paramData.endDate
                    },
                    color: '#4e87f9',
                    title: params[0].name,
                    content: `${params[0].seriesName} : ${params[0].value}`
                };
                return getTooltip(tempData);
            }
            return barOption;
        case 'pie':
            let pieOption = chart.chartPie;
            if (!Object.keys(result).length) {
                pieOption.series[0].data.map(item => {
                    item.value = 0;
                });
            } else {
                pieOption.series[0].data.map(item => {
                    item.value = result[item.name] || result[item.map] || 0;
                });
            }
            pieOption.tooltip.formatter = function (params) {
                const tempData = {
                    enable: stateData.formatter,
                    urlData: {
                        sensitive: params.data.media,
                        keyword: paramData.topicId,
                        day: paramData.day,
                        type: paramData.type,
                        startDate: paramData.startDate,
                        endDate: paramData.endDate
                    },
                    color: params.color,
                    title: params.seriesName,
                    content: `${params.name} : ${params.value} (${params.percent}%)`
                };
                return getTooltip(tempData);
            }
            return pieOption;
        case 'hollow':
            let hollowOption = chart.chartHollow;
            let webSite = result['web-site'] ? result['web-site'] : 0;
            let webMon = result['webmon'] ? result['webmon'] : 0;
            if (webSite + webMon !== 0) {
                result.web = webSite + webMon;
            }
            delete result['web-site'];
            delete result['webmon'];
            hollowOption.series[0].data = [];
            Object.keys(result).forEach((key, index) => {
                if (chart.hollowStaticData.map[key]) {
                    hollowOption.series[0].data.push({
                        name: chart.hollowStaticData.map[key],
                        value: result[key],
                        media: key
                    });
                } else {
                    if (hollowOption.series[0].data.some(item => {
                        return item.name === chart.hollowStaticData.other;
                    })) {
                        hollowOption.series[0].data.map(item => {
                            if (item.name === chart.hollowStaticData.other) {
                                item.value += result[key];
                                item.media += `,${key}`;
                            }
                        });
                    } else {
                        hollowOption.series[0].data.push({
                            name: chart.hollowStaticData.other,
                            value: result[key],
                            media: key
                        });
                    }
                }
            });

            if (!Object.keys(result).length) {
                hollowOption.series[0].data = chart.hollowStaticData.data;
            }
            hollowOption.tooltip.show = true;
            if ('tooltip' in stateData) {
                if (!stateData.tooltip) {
                    hollowOption.tooltip.show = false;
                }
            }
            hollowOption.tooltip.formatter = function (params) {
                const tempData = {
                    enable: stateData.formatter,
                    urlData: {
                        mediaType: params.data.media,
                        keyword: paramData.topicId,
                        day: paramData.day,
                        type: paramData.type,
                        startDate: paramData.startDate,
                        endDate: paramData.endDate
                    },
                    color: params.color,
                    title: params.seriesName,
                    content: `${params.name} : ${params.value} (${params.percent}%)`
                };
                return getTooltip(tempData);
            }
            return hollowOption;
        case 'radar':
            let radarOption = chart.chartRadar;
            let numArr = [];
            Object.keys(result).forEach((key, index) => {
                numArr.push(result[key]);
            });
            const maxNum = getMaxInt(numArr);
            radarOption.radar.indicator.map((item, index) => {
                if (result[item.name]) {
                    radarOption.series[0].data[0].value[index] = result[item.name];
                } else {
                    radarOption.series[0].data[0].value[index] = 0;
                }
                item.max = maxNum;
            });
            if (!Object.keys(result).length) {
                radarOption.radar.indicator.map((item, index) => {
                    radarOption.series[0].data[0].value[index] = 0;
                    item.max = 10;
                });
            }
            radarOption.tooltip.formatter = function (params) {
                const tempData = {
                    radar: params,
                    enable: stateData.formatter,
                    urlData: {
                        cultureLabel: 1,
                        type: paramData.type,
                        startDate: paramData.startDate,
                        endDate: paramData.endDate
                    },
                    color: params.color,
                    title: params.name
                };
                return getTooltip(tempData);
            }
            return radarOption;
        case 'word':
            let wordOption = chart.chartWord;
            wordOption.series[0].data = [];
            if (result instanceof Array) {
                wordOption.series[0].data = result;
            } else {
                Object.keys(result).forEach((key, index) => {
                    wordOption.series[0].data.push({
                        name: key,
                        value: result[key]
                    });
                });
            }
            wordOption.series[0].data.sort((a, b) => b.value - a.value);
            wordOption.series[0].data = wordOption.series[0].data.slice(0, 50);
            if (!Object.keys(result).length) {
                wordOption.series[0].data = [];
            }
            if (stateData.rotationRange) {
                wordOption.series[0].rotationRange = stateData.rotationRange;
            }
            if (stateData.rotationStep) {
                wordOption.series[0].rotationStep = stateData.rotationStep;
            }
            return wordOption;
        case 'graph':
            let graphOption = chart.chartGraph;
            let seriesData = [];
            graphOption.series[0].data = [];
            graphOption.series[0].links = [];
            seriesData.push({
                name: that.keyword,
                value: 50
            });
            Object.keys(result).forEach(key => {
                if (key !== that.keyword) {
                    graphOption.series[0].links.push({
                        source: that.keyword,
                        target: key
                    });
                }
                seriesData.push({
                    name: key,
                    value: result[key]
                });
            });
            seriesData.sort((a, b) => b.value - a.value);
            seriesData = seriesData.slice(0, 21);
            seriesData.forEach((item, index) => {
                if (item.name.length > 4) return;
                if (item.name !== that.keyword) {
                    if (item.name.length < 5) {
                    // if (index > seriesData.length / 2 || item.name.length > 3) {
                        graphOption.series[0].data.push({
                            name: item.name,
                            value: item.value,
                            symbolSize: 14,
                            itemStyle: {
                                normal: {
                                    color: '#6d9dfb'
                                    // color: '#91a2c3'
                                }
                            },
                            label: {
                                normal: {
                                    position: 'top'
                                }
                            }
                        });
                    }
                    //  else {
                    //     graphOption.series[0].data.push({
                    //         name: item.name,
                    //         value: item.value,
                    //         symbolSize: 30,
                    //         itemStyle: {
                    //             normal: {
                    //                 color: '#6d9dfb'
                    //             }
                    //         }
                    //     });
                    // }
                } else {
                    graphOption.series[0].data.push({
                        name: item.name,
                        value: item.value,
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: '#3a6fda'
                            }
                        }
                    });
                }
            });
            graphOption.series[0].force.repulsion = document.body.clientWidth > 400 ? 500 : 300;

            if (!Object.keys(result).length) {
                graphOption.series[0].data = [{
                    name: that.keyword,
                    value: 50,
                    symbolSize: 50,
                    itemStyle: {
                        normal: {
                            color: '#3a6fda'
                        }
                    }
                }];
                graphOption.series[0].links = [];
            }
            return graphOption;
    }
}
