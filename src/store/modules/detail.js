import api from './../../constants/api.js';
import chartMap from './../../constants/chart.js';
import dataInit from '../../common/dataInit';

export default {
  state: {
    data: {},
    detailTitle: '',
    aboutInfoList: dataInit('first'),
    hollowMapData: {}
  },
  mutations: {

  },
  actions: {
    newsDetail({ commit, state }, that) {
      state.data = {};
      let url = api.news_detail;
      if (that.type === 'opinion') {
        url = api.opinion_detail
      }
      const options = {
        method: 'get',
        url: url,
        params: {
          id: that.newsId
        }
      };
      if (that.type === 'message') {
        options.url = api.messgae_detail;
        options.params = {
          uid: that.msgUid
        }
      }
      that.$axios(options)
        .then((res) => {
          state.data = res.data.info || res.data;
          state.detailTitle = res.data.title || res.data.info.title;
          that.detailVisible = true;
          if (that.$route.name === 'share') {
            document.title = state.detailTitle;
          }
          if (res.data && !Object.keys(res.data).length) {
            that.detailVisible = false;
          } else {
            if (that.getAboutInfo) {
              that.getAboutInfo(that);
            }
            if (state.data && state.data.sensitiveLevel > 0 && state.data.sensitiveLevel < 4) {
              if (that.getDetailCharts) {
                that.getDetailCharts(that);
              }
            }
          }
        })
        .catch((err) => {
          console.log(err)
        });
    },
    getAboutInfo({commit, state}, that) {
			state.aboutInfoList = dataInit('first', state.aboutInfoList);
			if (that.type === 'opinion') {
				that.aboutType = 'opinions'
			} else {
				that.aboutType = 'website'
			}
			console.log(that.aboutType)
			const options = {
				method: 'get',
				url: api.about_info,
				params: {
					tags: that.tags,
					type: that.aboutType,
					showCount: 5,
					id: that.newsId,
					title: that.title || state.commentData.title
				}
      };
      const title = that.$route.query.title;
      if (that.type === 'opinion' && title && (title.includes('海航') || title === 'common.hna')) {
        options.params.hna = true;
      }
			that.$axios(options).then((res) => {
				if (res && res.data) {
					state.aboutInfoList = that.formatData(that, res.data, state.aboutInfoList);
				}
			}).catch(() => {
				state.aboutInfoList = dataInit('error', state.aboutInfoList);
			})
		},
    getDetailCharts({ commit, state }, that) {
      if (that.charts.dailyLine) {
        that.charts.dailyLine.showLoading({ color: '#2ec7c9' });
      }
      if (that.charts.dailyHollow) {
        that.charts.dailyHollow.showLoading({ color: '#2ec7c9' });
      }
      const options = {
        method: 'get',
        url: api.detail_trend,
        params: {
          title: that.title,
          id: that.newsId,
          groupId: ''
        }
      };
      that.$axios(options).then(res => {
        const result = {};
        if (res.data && res.data.mapPie) {
            Object.keys(res.data.mapPie).forEach(key => {
              if (key !== 'pie') {
                if (key === 'webmon' || key === 'web-site') {
                  result[chartMap.hollowStaticData.map['web']] = {};
                  Object.keys(res.data.mapPie[key]).forEach(child => {
                    result[chartMap.hollowStaticData.map['web']][child] = res.data.mapPie[key][child];
                  });
                } else {
                  result[chartMap.hollowStaticData.map[key]] = {};
                  Object.keys(res.data.mapPie[key]).forEach(child => {
                    result[chartMap.hollowStaticData.map[key]][child] = res.data.mapPie[key][child];
                  });
                }
              }
            })
        };
        state.hollowMapData = result;
        that.charts.dailyLine.hideLoading();
        that.charts.dailyLine.setOption(that.formatCharts(that, res.data && res.data.media, options.params, { type: 'line' }));
        that.charts.dailyHollow.hideLoading();
        that.charts.dailyHollow.setOption(that.formatCharts(that, res.data && res.data.mapPie && res.data.mapPie.pie, options.params, { type: 'hollow', tooltip: false }));
        that.charts.dailyHollow.on('click', function(data) {
          data.event.event.preventDefault();
          let popContent = '';
          Object.keys(state.hollowMapData).forEach(key => {
            if (key === data.name) {
              Object.keys(state.hollowMapData[key]).forEach(child => {
                popContent += `<div>${that.characters(child, 11)}（${state.hollowMapData[key][child]}）</div>`
              });
            }
          })
          that.Popup('show', {
            title: `${data.seriesName}${data.value} (${data.percent}%)`,
            content: popContent
          })
        })
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
