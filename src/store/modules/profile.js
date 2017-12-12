import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
  state: {
    data: {},
    lastVersion: '',
    myCommentList: dataInit('first')
  },
  mutations: {
    headerImg(state) {
      const profile = state.data;
      if (profile.empName) {
        profile.headerImg = profile.empName.slice(-2);
      }
    },
    closeMyopt(state, list) {
      state[list].forEach(item => {
        item.optShow = false;
      });
    }
  },
  actions: {
    getProfile({ commit, state }, that) {
      const options = {
        method: 'post',
        url: api.profile,
        baseURL: api.auth_baseUrl,
        data: {
          username: localStorage.userName || ''
        }
      };
      that.$axios(options)
        .then((res) => {
          state.data = res.data;
          commit('headerImg');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMyComment({ commit, state }, that) {
      state.myCommentList = dataInit(that.state, state.myCommentList);
      const options = {
        method: 'get',
        url: api.my_comment,
        params: {
          currentPage: state.myCommentList.page,
          userName: localStorage.userName,
          showCount: 10
        }
      };
      that.$axios(options).then((res) => {
        if (res && res.data) {
          state.myCommentList = that.formatData(that, res.data, state.myCommentList);
        }
      }).catch(() => {
        state.myCommentList = dataInit(that.state, state.myCommentList);
      })
    },
    getVersion({ commit, state }, that) {
      const options = {
        method: 'get',
        url: api.getVersion
      };
      that.$axios(options)
        .then((res) => {
          if (res.data && res.data.versionNumber) {
            let version = res.data.versionNumber.replace('v', '');
            if (localStorage.appVersion) {
              version = `_${version}`
            }
            state.lastVersion = version;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}
