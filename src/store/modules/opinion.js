import api from '../../constants/api';
import dataInit from '../../common/dataInit';

export default {
    state: {
        rootAll: '全部',
        reportType: [{
            name: 'day',
            value: 0,
            title: 'opinion.daily',
            read: 1
        }, {
            name: 'week',
            value: 7,
            title: 'opinion.weekly',
            read: 1
        }, {
            name: 'month',
            value: 30,
            title: 'opinion.monthly',
            read: 1
        }],
        chartsInfo: {
            startTime: new Date().setDate(new Date().getDate()),
            endTime: 'opinion.current',
            totalInfo: 0,
            sensitiveNews: 0,
            traditionalMedia: 0,
            newMedia: 0
        },
        reportPoint: false,
        newsData: dataInit('first'),
        summaryNews: dataInit('first'),
        commentData: {},
        companyCurrent: localStorage.companyCurrent ? localStorage.companyCurrent.split(',') : [],
        companyList: [{
            values: []
        }]
    },
    actions: {
        getReportInfo({ commit, state }, that) {
            if (that.charts.dailyLine) {
                that.charts.dailyLine.showLoading({ color: '#2ec7c9' });
            }
            if (that.charts.dailyBar) {
                that.charts.dailyBar.showLoading({ color: '#2ec7c9' });
            }
            if (that.charts.dailyPie) {
                that.charts.dailyPie.showLoading({ color: '#2ec7c9' });
            }
            if (that.charts.dailyHollow) {
                that.charts.dailyHollow.showLoading({ color: '#2ec7c9' });
            }
            let params = {};
            if (that.customDate) {
                params.startDate = that.pickerStart;
                params.endDate = that.pickerEnd;
            } else {
                params.type = state.reportType[that.dateType] && state.reportType[that.dateType].name;
            }
            params.empId = localStorage.userId || '';
            params.roleId = localStorage.roleId || '';
            that.$axios.get(api.report_info, {
                params
            }).then(res => {
                if (res && res.data && res.data.overview) {
                    state.chartsInfo.totalInfo = res.data.overview.total;
                    state.chartsInfo.sensitiveNews = res.data.overview.subTotal;
                    state.chartsInfo.traditionalMedia = res.data.overview.traditionalTotal;
                    state.chartsInfo.newMedia = res.data.overview.newTotal;
                    if (that.customDate) {
                        state.chartsInfo.startTime = params.startDate;
                        state.chartsInfo.endTime = params.endDate;
                    } else {
                        state.chartsInfo.startTime = res.data.overview.startTime;
                        state.chartsInfo.endTime = 'opinion.current';
                    }
                }
                that.charts.dailyLine.hideLoading();
                that.charts.dailyLine.setOption(that.formatCharts(that, res.data && res.data.mediaVolume, params, { type: 'line', formatter: true }));

                that.charts.dailyBar.hideLoading();
                that.charts.dailyBar.setOption(that.formatCharts(that, res.data && res.data.companyTransmissionVolume, params, { type: 'bar', formatter: true }));

                that.charts.dailyPie.hideLoading();
                that.charts.dailyPie.setOption(that.formatCharts(that, res.data && res.data.analysisMedia, params, { type: 'pie', formatter: true }));

                that.charts.dailyHollow.hideLoading();
                that.charts.dailyHollow.setOption(that.formatCharts(that, res.data && res.data.typeTransmissionVolume, params, { type: 'hollow', formatter: true }));
            });
        },
        getOpinionRadar({ commit, state }, that) {
            if (that.charts.dailyRadar) {
                that.charts.dailyRadar.showLoading({ color: '#2ec7c9' });
            }
            let params = {};
            if (that.customDate) {
                params.startDate = that.pickerStart;
                params.endDate = that.pickerEnd;
            } else {
                params.type = state.reportType[that.dateType] && state.reportType[that.dateType].name;
            }
            params.empId = localStorage.userId || '';
            params.roleId = localStorage.roleId || '';
            that.$axios.get(api.opinion_radar, {
                params
            }).then(res => {
                const stateData = {
                    type: 'radar',
                    formatter: true
                };
                that.charts.dailyRadar.hideLoading();
                that.charts.dailyRadar.setOption(that.formatCharts(that, res.data, params, stateData));
            });
        },
        getOpinionWord({ commit, state }, that) {
            if (that.charts.dailyWord) {
                that.charts.dailyWord.showLoading({ color: '#2ec7c9' });
            }
            let params = {};
            if (that.customDate) {
                params.startDate = that.pickerStart;
                params.endDate = that.pickerEnd;
            } else {
                params.type = state.reportType[that.dateType] && state.reportType[that.dateType].name;
            }
            params.empId = localStorage.userId || '';
            params.roleId = localStorage.roleId || '';
            that.$axios.get(api.opinion_word, {
                params
            }).then(res => {
                const stateData = {
                    type: 'word'
                };
                that.charts.dailyWord.hideLoading();
                that.charts.dailyWord.setOption(that.formatCharts(that, res.data, params, stateData));
                that.charts.dailyWord.on('click', function word(data) {
                    that.$router.push({
                        name: 'wordDetail',
                        query: {
                            searchText: data.name,
                            startDate: params.startDate,
                            endDate: params.endDate,
                            type: params.type
                        }
                    });
                });
            });
        },
        getOpinionNews({ commit, state }, that) {
            state.newsData = dataInit(that.state, state.newsData);
            let params = {};
            if (that.customDate) {
                params.startDate = that.pickerStart;
                params.endDate = that.pickerEnd;
            } else {
                params.type = state.reportType[that.dateType] && state.reportType[that.dateType].name;
            }
            params.empId = localStorage.userId || '';
            params.roleId = localStorage.roleId || '';
            params.currentPage = state.newsData.page;
            params.showCount = 10;
            that.$axios.get(api.opinion_news, {
                params
            }).then(res => {
                state.newsData = that.formatData(that, res.data, state.newsData);
            })
            .catch(() => {
                state.newsData = dataInit('error', state.newsData);
            })
        },
        getSummaryNews({ commit, state }, that) {
            state.summaryNews = dataInit(that.state, state.summaryNews);
            let params = {};
            if (that.customDate) {
                params.startDate = that.pickerStart;
                params.endDate = that.pickerEnd;
            } else {
                params.type = state.reportType[that.dateType] && state.reportType[that.dateType].name;
            }
            if (that.source) {
                params.source = that.source;
                if (!params.startDate) {
                    params.startDate = that.getTimeStamp(2);
                    params.endDate = that.getTimeStamp(0);
                }
            }
            if (that.source === '' && !params.startDate) {
                params.startDate = that.getTimeStamp(2);
                params.endDate = that.getTimeStamp(0);
            }
            if (that.pickerItemValue && that.pickerItemValue !== that.$t('opinion.select') && that.pickerItemValue !== state.rootAll) {
                state.companyCurrent.forEach(item => {
                    if (item.replace(/[+-]/g, '') === that.pickerItemValue) {
                        params.searchCompany = item;
                    }
                })
            }
            params.currentPage = state.summaryNews.page;
            params.showCount = 10;
            params.empId = localStorage.userId || '';
            params.roleId = localStorage.roleId || '';
            that.$axios.get(api.opinion_news, {
                params
            }).then(res => {
                state.summaryNews = that.formatData(that, res.data, state.summaryNews);
            })
            .catch(() => {
                state.summaryNews = dataInit('error', state.summaryNews);
            })
        },
        getSummaryCompany({ commit, state }, that) {
            that.$axios.get(`${api.summary_company}/${localStorage.roleId || ''}`).then(res => {
                if (res && res.data) {
                    let companyArr = [];
                    state.companyCurrent = res.data.companyList;
                    localStorage.companyCurrent = state.companyCurrent.toString();
                    res.data.companyList.map(item => {
                        companyArr.push(item.replace(/[+-]/g, ''))
                    })
                    companyArr.unshift(state.rootAll);
                    state.companyList[0].values = companyArr;
                }
            })
        },
        getOpinionComment({ commit, state }, that) {
            const opinions = {
                method: 'get',
                baseURL: api.auth_baseUrl,
                url: `${api.opinion_comment}/${state.reportType[that.dateType] && state.reportType[that.dateType].name}`
            };
            that.$axios(opinions).then((res) => {
                if (res && res.data && res.data.length > 0) {
                    state.commentData = res.data[0];
                }
            }).catch((err) => {
                console.log(err);
            })
        },
        getOpinionRead({ commit, state }, that) {
            const params = {
                userName: localStorage.userName || ''
            };
            that.$axios.get(api.report_unread, { params }).then(res => {
                if (res && res.data) {
                    state.reportType.map(item => {
                        if (res.data[item.name]) {
                            item.read = res.data[item.name];
                        }
                    });
                }
                state.reportPoint = state.reportType.some(item => item.read === '0');
            })
        },
        updateOpinionRead({ commit, state }, that) {
            const data = {
                pushRecord: 1,
                type: state.reportType[that.dateType] && state.reportType[that.dateType].name,
                userName: localStorage.userName || ''
            }
            that.$axios.post(api.report_read, data).then(res => {
                console.log(res)
                if (res && res.data && res.data.code === '0') {
                    that.getOpinionRead(that);
                }
            })
        }
    }
}
