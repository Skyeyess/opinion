import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
  state: {
    totalPage: NaN,
    count: null,
    messageData: dataInit('first')
  },
  mutations: {
    changeCount(state) {
      state.count--;
    }
  },
  actions: {
    getMessageList({ commit, state }, that) {
      state.messageData = dataInit(that.state, state.messageData);
      const options = {
        method: 'get',
        url: api.message_list,
        params: {
          userName: localStorage.userName,
          currentPage: state.messageData.page,
          showCount: 100
        }
      };
      that.$axios(options)
        .then((res) => {
          state.messageData = that.formatData(that, res.data, state.messageData);
          that.isArrayRead = that.messageData.list.some(item => {
            return item.isRead > 1;
          });
        })
        .catch(() => {
          state.messageData = dataInit('error', state.messageData);
        });
    },
    // 删除单条消息
    deleteMessage({ commit, state }, that) {
      const options = {
        method: 'delete',
        url: `${api.delete_message}/${that.msgObj.uid}/0`
      };
      that.$axios(options).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.log(err);
      })
    },
    // 不再推送
    anyMorePush({ commit, state }, that) {
      const options = {
        method: 'put',
        url: `${api.delete_message}/${that.pushUid}/${that.pushSwitch}`
      };
      that.$axios(options).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.log(err);
      })
    },
    getNoReads({ commit, state }, that) {
      const options = {
        method: 'get',
        url: api.message_noRead,
        params: {
          userName: localStorage.userName || ''
        }
      };
      that.$axios(options)
        .then((res) => {
          state.count = res.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postReaded({ commit, state }, that) {
      const options = {
        method: 'post',
        url: api.message_Readed,
        data: {
          uid: that.readId,
          isRead: 1
        }
      };
      that.$axios(options)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // some 开关接口
    getSwitchStatus({ commit, state }, that) {
      const isTrue = {
        0: true,
        1: false
      };
      const options = {
        method: 'get',
        url: api.get_switches,
        params: {
          userName: localStorage.userName
        }
      };
      that.$axios(options)
        .then((res) => {
          const switchObj = res.data.pushUser;
          if (!switchObj) {
            that.appShow = false;
            return
          }
          that.appShow = !switchObj.isApp;
          that.emailShow = !switchObj.isEmail;
          that.appValue = isTrue[switchObj.appType];
          that.emailValue = isTrue[switchObj.appSensitive];

          that.opinionValue = isTrue[switchObj.emailType];
          that.dataValue = isTrue[switchObj.emailSensitive];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    switchMessageApp({ commit, state }, that) {
      const options = {
        method: 'put',
        url: api.switch_message,
        data: {
          userName: localStorage.userName,
          appType: that.postSwitch(that.appValue)
        }
      };
      that.$axios(options)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    switchMessageEmail({ commit, state }, that) {
      const options = {
        method: 'put',
        url: api.switch_message,
        data: {
          userName: localStorage.userName,
          appSensitive: that.postSwitch(that.emailValue)
        }
      };
      that.$axios(options)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    switchMessageOpinion({ commit, state }, that) {
      const options = {
        method: 'put',
        url: api.switch_message,
        data: {
          userName: localStorage.userName,
          emailType: that.postSwitch(that.opinionValue)
        }
      };
      that.$axios(options)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    switchMessageData({ commit, state }, that) {
      const options = {
        method: 'put',
        url: api.switch_message,
        data: {
          userName: localStorage.userName,
          emailSensitive: that.postSwitch(that.dataValue)
        }
      };
      that.$axios(options)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    readedAllMsg({commit, state}, that) {
      const options = {
        method: 'get',
        url: api.readed_all,
        params: {
          userName: localStorage.userName
        }
      };
      that.$axios(options).then(res => {
        that.Notice('success', '消息全部已读', 1000);
        that.sendClient({body: '0', type: 'badgeCount'});
        state.messageData.list.forEach(item => {
          item.isRead = 1;
        });
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
