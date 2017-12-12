import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
    state: {
        newsList: [],
        filterTime: ['opinion.today', 'opinion.weekDay', 'opinion.monthDay'],
        postTimeArr: [1, 7, 30],
        subjectArr: [],
        keywordNews: dataInit('first'),
        totalPage: NaN
    },
    mutations: {
        specialClear(state) {
            state.keywordNews = [];
        }
    },
    actions: {
        getSpecialNews({ commit, state }, that) {
            state.keywordNews = dataInit(that.state, state.keywordNews);
            const keywords = that.filterWordId.toString();
            const options = {
                method: 'get',
                url: api.sensitive_news,
                params: {
                    currentPage: state.keywordNews.page,
                    showCount: 10,
                    day: that.postTime,
                    keyword: keywords,
                    empId: localStorage.userId || '',
                    roleId: localStorage.roleId || '',
                    type: that.customType
                }
            };
            that.$axios(options).then((res) => {
                state.keywordNews = that.formatData(that, res.data, state.keywordNews);
            }).catch(() => {
                state.keywordNews = dataInit('error', state.keywordNews);
            })
        },
        getSpecialCharts({ commit, state }, that) {
            if (that.charts.dailyLine) {
                that.charts.dailyLine.showLoading({ color: '#2ec7c9' });
            }
            if (that.charts.dailyPie) {
                that.charts.dailyPie.showLoading({ color: '#2ec7c9' });
            }
            if (that.charts.dailyHollow) {
                that.charts.dailyHollow.showLoading({ color: '#2ec7c9' });
            }
            const params = {
                day: that.postTime,
                topicId: that.filterWordId.toString(),
                empId: localStorage.userId || '',
                roleId: localStorage.roleId || ''
            };
            that.$axios.get(api.special_info, {
                params
            }).then(res => {
                that.charts.dailyLine.hideLoading();
                that.charts.dailyLine.setOption(that.formatCharts(that, res.data && res.data.mediaVolume, params, { type: 'line', formatter: true }));

                that.charts.dailyPie.hideLoading();
                that.charts.dailyPie.setOption(that.formatCharts(that, res.data && res.data.analysisMedia, params, { type: 'pie', formatter: true }));

                that.charts.dailyHollow.hideLoading();
                that.charts.dailyHollow.setOption(that.formatCharts(that, res.data && res.data.typeTransmissionVolume, params, { type: 'hollow', formatter: true }));
            });
        }
    }
}
