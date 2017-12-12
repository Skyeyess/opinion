import api from '../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
	state: {
		collectionList: dataInit('first')
	},
	actions: {
		// 获取收藏
		getCollectionList({commit, state}, that) {
			state.collectionList = dataInit(that.state, state.collectionList);
			const options = {
				method: 'get',
				url: api.hnaCollect,
				params: {
					currentPage: state.collectionList.page,
					showCount: 100,
					empId: localStorage.userId
				}
			}
			that.$axios(options).then((res) => {
				state.collectionList = that.formatData(that, res.data, state.collectionList);
			}).catch(() => {
				state.collectionList = dataInit('error', state.collectionList);
			})
		},
		// 查询是否收藏
		checkIscollect({commit, state}, that) {
			const options = {
				method: 'post',
				url: api.hnaIsCollect,
				data: {
					empId: localStorage.userId,
					articleId: that.newsId
				}
			}
			that.$axios(options).then((res) => {
				if (res.data.isCollected) {
					that.isCollection = parseInt(res.data.isCollected)
				}
			}).catch((err) => {
				console.log(err);
			})
		},
		// 收藏文章
		confirmCollection({commit, state}, that) {
			const options = {
				method: 'post',
				url: api.hnaCollect,
				data: {
					empId: localStorage.userId,
					articleId: that.newsId
				}
			}
			that.$axios(options).then((res) => {
				that.Notice('success', 'collection.success');
			}).catch((err) => {
				console.log(err);
				that.Notice('fail', 'collection.fail');
			})
		},
		// {{$t('common.cancel')}}收藏
		cancelCollection({commit, state}, that) {
			const options = {
				method: 'post',
				url: api.cancelHnaCollect,
				data: {
					empId: localStorage.userId,
					articleId: that.newsId
				}
			}
			that.$axios(options).then((res) => {
				that.Notice('success', 'collection.cancel');
			}).catch((err) => {
				console.log(err);
				that.Notice('fail', 'collection.cancelFail');
			})
		},
		// 查询收藏详情
		getCollection({commit, state}, that) {
			const options = {
				method: 'get',
				url: `${api.getCollcetion}/${that.articleId}`
			}
			that.$axios(options).then((res) => {
				console.log(res.data);
			}).catch((err) => {
				console.log(err);
			})
		}
	}
}
