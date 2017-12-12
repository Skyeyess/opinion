import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
  state: {
    tabDefault: '热点',
    tabsArr: ['热点'],
    noTabsArr: [],
    data: {
      0: dataInit('first'),
      1: dataInit('first'),
      2: dataInit('first'),
      3: dataInit('first'),
      4: dataInit('first'),
      5: dataInit('first'),
      6: dataInit('first'),
      7: dataInit('first'),
      8: dataInit('first'),
      9: dataInit('first')
    },
    hottopicId: null,
    topSpot: [],
    cloudWords: [],
    transType: {
      '热点': 'hot',
      '财经': 'finance',
      '科技': 'technology',
      '航空': 'aviation',
      '旅游': 'tour',
      '新闻': 'news',
      '时政': 'politics'
    }
  },
  mutations: {

  },
  actions: {
    // axios异步请求函数
    getTopHot({ commit, state }, that) {
      state.topSpot = [];
      let params = {
        empId: localStorage.userId || '',
        groupId: localStorage.groupId || '',
        topic: '',
        type: state.transType[that.selected],
        date: new Date().getTime(),
        currentPage: 1,
        showCount: 10
      };
      that.$axios.get(api.hot_wordcloud, {
        params
      }).then(res => {
        let cloudWords = [];
        if (res && res.data && res.data.rows && res.data.rows.length) {
          state.hottopicId = res.data.rows[0].id;
          let topic = res.data.rows[0].topic;
          let topicArr = [];
          topic = topic.replace(/\n/g, '');
          topic = topic.replace(/ /g, '');
          topic = JSON.parse(topic);
          topic.sort((a, b) => b.weight - a.weight);
          topic.forEach(item => {
            if (item.associationsIds.length && item.topic.length < 3) {
              if (topicArr.every(child => child.topic !== item.topic)) {
                topicArr.push(item);
                cloudWords.push({ name: item.topic, value: item.weight });
              }
            }
          });
          topicArr = topicArr.slice(0, 9);
          state.topSpot = topicArr;
        }
        state.topSpot.forEach((item, index) => {
          item.mapType = state.transType[that.selected];
        })
      });
    },
    askNews({ commit, state }, that) {
      state.data[that.isActive] = dataInit(that.state, state.data[that.isActive]);
      const sectionName = that.selected === state.tabDefault ? '' : that.selected;
      const options = {
        method: 'get',
        url: api.home_news,
        params: {
          day: 6,
          label: 2,
          order: 2,
          currentPage: state.data[that.isActive].page,
          showCount: 20,
          subSectionName: sectionName
        }
      };
      // for (let key of state.tabsArr.keys()) {
      //   state.data[key] = [];
      // }
      that.$axios(options)
        .then((res) => {
          that.isAnimate = true;
          state.data[that.isActive] = that.formatData(that, res.data, state.data[that.isActive]);
        })
        .catch(() => {
          state.data[that.isActive] = dataInit('error', state.data[that.isActive]);
        });
    },
    getTags({ commit, state }, that) {
      const options = {
        method: 'post',
        url: api.getTags,
        data: {
          userName: localStorage.userName
        }
      };
      that.$axios(options).then((res) => {
        if (res.data.subscribed !== '') {
          const newTabsArr = res.data.subscribed.split(',');
          state.tabsArr = [state.tabDefault].concat(newTabsArr);
        } else {
          state.tabsArr = [state.tabDefault];
        }
        if (res.data.unSubscribed !== '') {
          state.noTabsArr = res.data.unSubscribed.split(',');
        } else {
          state.noTabsArr = [];
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    addTag({ commit, state }, that) {
      if (!that.tabsArr.indexOf(state.tabDefault)) {
        that.tabsArr.splice(0, 1);
      }
      const options = {
        method: 'post',
        url: api.addTag,
        data: {
          userName: localStorage.userName,
          industryName: that.tabsArr.toString()
        }
      };
      that.$axios(options).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.log(err);
      })
    },
    deleteTag({ commit, state }, that) {
      const options = {
        method: 'post',
        url: api.deleteTag,
        data: {
          userName: localStorage.userName,
          industryName: that.noTabsArr.toString()
        }
      };
      that.$axios(options).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.log(err);
      })
    }
  }
}
