import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
	state: {
		newsList: [],
		filterTime: ['opinion.today', 'opinion.weekDay', 'opinion.monthDay'],
		postTimeArr: [1, 7, 30],
		filterSpecial: [],
		subjectArr: [],
		keywordNews: dataInit('first'),
		totalPage: NaN,
		customType: NaN
	},
	mutations: {
		fixCustomType(state, type) {
			state.customType = type;
		},
		sensitiveClear(state) {
			state.keywordNews = [];
		}
	},
	actions: {
		getKeyWord({ commit, state }, that) {
			const userId = localStorage.userId || '';
			const options = {
				method: 'get',
				url: `${api.screen_special}/${state.customType}/${userId}`
			};
			that.$axios(options).then((res) => {
				state.subjectArr = res.data;
				const newsData = res.data;
				const newsArr = [];
				for (const item of newsData) {
					newsArr.push({ subjectName: item.subjectName, id: item.id });
				}
				state.filterSpecial = newsArr;
			}).catch((err) => {
				console.log(err);
			});
		},
		getSensitiveNews({ commit, state }, that) {
			if (that.searchWord && that.textInvalid(that.searchWord)) {
				// that.$messagebox({
				// 	title: that.$t('common.prompt'),
				// 	message: that.$t('common.illegalChar'),
				// 	confirmButtonText: that.$t('common.ok')
				// });
				that.Notice('fail', 'common.illegalChar');
				return;
			}
			state.keywordNews = dataInit(that.state, state.keywordNews);
			if (that.searchWord) {
				state.keywordNews.highLight = that.searchWord;
			} else {
				state.keywordNews.highLight = null;
			}
			// const keywords = that.filterWordId.toString();

			const options = {
				method: 'get',
				url: api.sensitive_news,
				params: {
					currentPage: state.keywordNews.page,
					showCount: 10,
					day: that.postTime,
					keyword: that.searchWord,
					empId: localStorage.userId || '',
					roleId: localStorage.roleId || '',
					type: state.customType
				}
			};
			if (/^[0-9]*$/.test(that.pickerStart)) {
				options.params.startDate = that.pickerStart;
			}
			if (/^[0-9]*$/.test(that.pickerEnd)) {
				options.params.endDate = that.pickerEnd;
			}
			that.$axios(options).then((res) => {
				state.keywordNews = that.formatData(that, res.data, state.keywordNews);
			}).catch(() => {
				state.keywordNews = dataInit('error', state.keywordNews);
			})
		},
		addKeyword({ commit, state }, that) {
			const keywords = that.keyInput.toString();
			const options = {
				method: 'post',
				url: api.screen_special,
				data: {
					empId: localStorage.userId || '',
					customType: state.customType,
					subjectName: that.specialName,
					keyword: keywords
				}
			};
			that.$axios(options).then((res) => {
				console.log(res.data);
				that.$router.go(-1);
			}).catch((err) => {
				console.log(err);
			});
		},
		deleteKeyword({ commit, state }, that) {
			const options = {
				method: 'delete',
				url: `${api.screen_special}/${that.keyId}`
			};
			that.$axios(options).then((res) => {
				console.log(res.data);
			}).catch((err) => {
				console.log(err);
			});
		},
		getKeyword({ commit, state }, that) {
			const options = {
				method: 'get',
				url: `${api.keyword_detail}/${that.keywordId}`
			};
			that.$axios(options).then((res) => {
				that.specialName = res.data.subjectName;
				that.keyInput = res.data.keyword.split(',');
			}).catch((err) => {
				console.log(err);
			});
		},
		editKeywords({ commit, state }, that) {
			const keywords = that.keyInput.toString();
			const options = {
				method: 'put',
				url: api.screen_special,
				data: {
					id: that.keywordId,
					subjectName: that.specialName,
					keyword: keywords
				}
			};
			that.$axios(options).then((res) => {
				console.log(res.data);
				that.$router.go(-1);
			}).catch((err) => {
				console.log(err);
			});
		}
	}
}
