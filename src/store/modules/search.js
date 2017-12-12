import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
  state: {
    totalPage: 1,
    data: dataInit('first')
  },
  mutations: {
    searchClear(state) {
      state.data = dataInit('first');
      state.data.status = false;
    }
  },
  actions: {
    searchNews({ commit, state }, that) {
      state.data = dataInit(that.state, state.data);
      if (that.searchWord) {
				state.data.highLight = that.searchWord;
			} else {
				state.data.highLight = null;
			}
      let options = {
        method: 'get'
        // url: api.home_search,
        // params: {
        //   day: 0,
        //   label: 2,
        //   order: 1,
        //   currentPage: state.data.page,
        //   showCount: 10,
        //   d_keyword: that.searchWord,
        //   empId: localStorage.userId || '',
        //   username: localStorage.userName || ''
        // }
      };
      // if (that.$route.query.routeType && that.$route.query.routeType !== 'index') {
        options.url = api.search_all;
        options.params = {
          currentPage: state.data.page,
          showCount: 10,
          type: 'month',
          keyword: that.searchWord,
          empId: localStorage.userId || '',
          username: localStorage.userName || ''
        // };
      }
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
