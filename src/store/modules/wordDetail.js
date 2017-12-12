import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
  state: {
    totalPage: 1,
    data: dataInit('first')
  },
  mutations: {},
  actions: {
    wordChart({ commit, state }, that) {
      if (that.chart) {
        that.chart.showLoading({ color: '#2ec7c9' });
      }
      const options = {
        method: 'get',
        url: api.search_chart,
        params: {
          keyword: that.searchText,
          roleId: localStorage.roleId
        }
      };
      that.$axios(options)
        .then((res) => {
          const stateData = {
              type: 'line'
          };
          that.chart.hideLoading();
          that.chart.setOption(that.formatCharts(that, res.data, options.params, stateData));
        })
    },
    wordNews({ commit, state }, that) {
      state.data = dataInit(that.state, state.data);
      if (that.searchText) {
				state.data.highLight = that.searchText;
			} else {
				state.data.highLight = null;
			}
      let options = {
        method: 'get',
        url: api.search_news,
        params: {
          currentPage: state.data.page,
          showCount: 10,
          keyword: that.searchText,
          startDate: that.startDate,
          endDate: that.endDate,
          type: that.type,
          roleId: localStorage.roleId
        }
      };
      that.$axios(options)
        .then((res) => {
          state.data = that.formatData(that, res.data, state.data);
        })
        .catch(() => {
          state.data = dataInit('error', state.data);
        });
    }
  }
}
