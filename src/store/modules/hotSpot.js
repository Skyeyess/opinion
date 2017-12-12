import api from '../../constants/api';
import dataInit from '../../common/dataInit';
export default {
    state: {
        newsData: dataInit('first')
    },
    actions: {
        getHotSpotGraph({ commit, state }, that) {
            if (that.charts.dailyGraph) {
                that.charts.dailyGraph.showLoading({ color: '#3a6fda' });
            }
            let params = {};
            params.topic = that.keyword;
            params.hottopicId = that.hottopicId;
            that.$axios.get(api.hot_graph, {
                params
            }).then(res => {
                let associations = {};
                if (res && res.data && res.data.associations) {
                    associations = res.data.associations;
                }
                const stateData = {
                    type: 'graph'
                };
                that.charts.dailyGraph.hideLoading();
                that.charts.dailyGraph.setOption(that.formatCharts(that, associations, params, stateData));
            });
        },
        getHotSpotCharts({ commit, state }, that) {
            if (that.charts.dailyPie) {
                that.charts.dailyPie.showLoading({ color: '#2ec7c9' });
            }
            if (that.charts.dailyBar) {
                that.charts.dailyBar.showLoading({ color: '#2ec7c9' });
            }
            if (that.charts.dailyLine) {
                that.charts.dailyLine.showLoading({ color: '#2ec7c9' });
            }
            let params = {};
            params.hottopicId = that.hottopicId;
            params.topic = that.keyword;
            that.$axios.get(api.hot_charts, {
                params
            }).then(res => {
                if (res && res.data) {
                    that.charts.dailyPie.hideLoading();
                    that.charts.dailyPie.setOption(that.formatCharts(that, res.data.labelMap, params, { type: 'pie' }));

                    that.charts.dailyBar.hideLoading();
                    that.charts.dailyBar.setOption(that.formatCharts(that, res.data.mediaMap, params, { type: 'bar' }));

                    that.charts.dailyLine.hideLoading();
                    that.charts.dailyLine.setOption(that.formatCharts(that, res.data.emotionMap, params, { type: 'line' }));
                }
            });
        },
        getHotSpotNews({ commit, state }, that) {
            state.newsData = dataInit(that.state, state.newsData);
            let params = {
                hottopicId: that.hottopicId,
                topic: that.keyword,
                currentPage: state.newsData.page,
                showCount: 10,
                subTopic: that.subTopicText
            };
            that.$axios.get(api.hot_news, {
                params
            }).then(res => {
                state.newsData = that.formatData(that, res.data, state.newsData);
            })
            .catch(() => {
                state.newsData = dataInit('error', state.newsData);
            })
        }
    }
}
