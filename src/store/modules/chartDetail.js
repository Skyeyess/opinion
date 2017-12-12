import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
  state: {
    hollowList: ['企业动态', '营销活动', '社会责任', '其他'],
    data: dataInit('first')
  },
  mutations: {},
  actions: {
    chartNews({ commit, state }, that) {
      state.data = dataInit(that.state, state.data);
      let options = {
        method: 'get',
        url: api.search_news,
        params: {
          currentPage: state.data.page,
          showCount: 10,
          empId: localStorage.userId || '',
          roleId: localStorage.roleId || ''
        }
      };
      if ('keyword' in that.routeData) {
        options.url = api.special_news
      }
      Object.keys(that.routeData).forEach(key => {
        options.params[key] = that.routeData[key];
      });
      that.$axios(options)
        .then((res) => {
          state.data = that.formatData(that, res.data, state.data);
        })
        .catch(() => {
          state.data = dataInit('error', state.data);
        })
    }
  }
}
