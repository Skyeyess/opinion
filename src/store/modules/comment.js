import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
    state: {
        commentList: dataInit('first'),
        commentHot: dataInit('first'),
        commentCount: 0,
        commentData: {
            title: '',
            source: '',
            time: ''
        },
        replyList: dataInit('first'),
        reportTypes: []
    },
    mutations: {
        countLess(state) {
            if (state.commentCount > 0) {
                state.commentCount -= 1;
                state.commentList.total -= 1;
            }
            if (!state.commentList.total) {
                state.commentList.status = true;
                state.commentList.none = true;
            }
        },
        countPlus(state) {
            state.commentCount += 1;
            state.commentList.total += 1;
            state.commentList.status = false;
            state.commentList.none = false;
        },
        addReplyTop(state, replyTopData) {
            replyTopData.operateShow = false;
            replyTopData.deleteList = true;
            if (!replyTopData.likeCount) {
                replyTopData.likeCount = 0;
                replyTopData.laud = false;
            }
            state.replyList.splice(1, 0, replyTopData);
        }
    },
    actions: {
        getCommentCount({ commit, state }, that) {
            const options = {
                method: 'post',
                url: api.comment_count,
                data: {
                    targetId: that.newsId,
                    userName: localStorage.userName
                }
            };
            that.$axios(options)
                .then((res) => {
                    if (res.data && res.data.code && res.data.code === '0') {
                        state.commentCount = Number(res.data.count) || 0;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getReplyList({ commit, state }, that) {
            state.replyList = dataInit(that.state, state.replyList);
            const options = {
                method: 'get',
                url: api.comment_reply,
                params: {
                    targetId: that.newsId,
                    commonId: that.commonId,
                    userName: localStorage.userName,
                    currentPage: state.replyList.page,
                    showCount: 10
                }
            };
            that.$axios(options)
                .then((res) => {
                    if (res && res.data) {
                        if (state.replyList.page === 1) {
                            res.data.first = res.data.rows;
                        } else {
                            res.data.first = null;
                        }
                        res.data.entries = res.data.replyCommentMap;
                        state.replyList = that.formatData(that, res.data, state.replyList);
                    }
                })
                .catch(() => {
                    state.replyList = dataInit('error', state.replyList);
                });
        },
        getCommentHot({ commit, state }, that) {
            state.commentHot = dataInit(that.state, state.commentHot);
            const options = {
                method: 'get',
                url: api.comment_hot,
                params: {
                    targetId: that.newsId,
                    userName: localStorage.userName,
                    showCount: 3
                }
            };
            that.$axios(options)
                .then((res) => {
                    if (res && res.data) {
                        state.commentHot = that.formatData(that, res.data, state.commentHot);
                    }
                })
                .catch(() => {
                    state.commentHot = dataInit('error', state.commentHot);
                });
        },
        getCommentList({ commit, state }, that) {
            state.commentList = dataInit(that.state, state.commentList);
            const options = {
                method: 'get',
                url: api.comment_get,
                params: {
                    targetId: that.newsId,
                    userName: localStorage.userName,
                    currentPage: state.commentList.page,
                    showCount: 10
                }
            };
            that.$axios(options)
                .then((res) => {
                    if (res && res.data) {
                        state.commentList = that.formatData(that, res.data, state.commentList);
                        state.commentData.title = res.data.info.title || '';
                        state.commentData.source = res.data.info.sourceName || '';
                        state.commentData.time = res.data.info.createdAt || '';
                    }
                })
                .catch(() => {
                    state.commentList = dataInit('error', state.commentList);
                });
        },
        addComment({ commit, state }, that) {
            const options = {
                method: 'post',
                url: api.comment,
                data: that.requestData
            };
            that.$axios(options)
                .then((res) => {
                    if (res.data && res.data.code && res.data.code === '0') {
                        that.$emit('sendComment', that.formatData(that, { rows: [res.data.comment] }, { list: [] }).list[0]);
                        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                            that.sendClient({ body: true, type: 'commentClose' })
                        }
                        that.$parent.commentInput = true;
                        that.commentText = '';
                        that.Notice('success', 'comment.sendSuccess');
                    } else {
                        let msg = 'comment.sendFail';
                        switch (res.data.code) {
                            case '-4':
                                msg = 'comment.sensitive'
                                break;
                            case '-11':
                                msg = 'comment.deleted'
                                break;
                            case '-13':
                                msg = 'comment.disable'
                                break;
                        }
                        that.Notice('fail', msg);
                    }
                    that.commentSend = true;
                })
                .catch(err => {
                    console.log(err);
                    that.commentSend = true;
                    that.Notice('fail', 'comment.sendFail');
                });
        },
        delComment({ commit, state }, that) {
            const options = {
                method: 'delete',
                url: `${api.comment}/${that.deleteId}`
            };
            that.$axios(options)
                .then((res) => {
                    if (res.data && res.data.code && res.data.code === '0') {
                        that.Notice('success', 'comment.delSuccess');
                        that.$emit('remove', that.current);
                    } else {
                        that.Notice('fail', 'comment.delFail');
                    }
                })
                .catch(err => {
                    console.log(err);
                    that.Notice('fail', 'comment.delFail');
                });
        },
        addLike({ commit, state }, that) {
            const options = {
                method: 'post',
                url: api.like_add,
                data: {
                    targetId: that.likeId,
                    userName: localStorage.userName
                }
            };
            that.$axios(options)
                .then((res) => {
                    if (res.data && res.data.code && res.data.code === '0') {
                        console.log(res.data);
                    } else {
                        that.Notice('fail', 'comment.likeFail');
                    }
                })
                .catch(err => {
                    console.log(err);
                    that.Notice('fail', 'comment.likeFail');
                });
        },
        delLike({ commit, state }, that) {
            const options = {
                method: 'post',
                url: api.like_del,
                data: {
                    targetId: that.likeId,
                    userName: localStorage.userName
                }
            };
            that.$axios(options)
                .then((res) => {
                    if (res.data && res.data.code && res.data.code === '0') {
                        console.log(res.data);
                    } else {
                        that.Notice('fail', 'comment.likeCancelFail');
                    }
                })
                .catch(err => {
                    console.log(err);
                    that.Notice('fail', 'comment.likeCancelFail');
                });
        },
        getReportType({ commit, state }, that) {
            const options = {
                method: 'get',
                url: api.report_type
            };
            that.$axios(options)
                .then((res) => {
                    if (res.data) {
                        state.reportTypes = res.data;
                        that.reportType = res.data[0].key;
                        that.reportVal = res.data[0].val;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        reportComment({ commit, state }, that) {
            const options = {
                method: 'post',
                url: api.report_comment,
                data: {
                    reportType: that.reportType,
                    reportContent: that.reportVal || that.reportContent,
                    commentId: that.$parent.commentId,
                    userName: localStorage.userName
                }
            };
            that.$axios(options)
                .then((res) => {
                    if (res.data && res.data.code && res.data.code === '0') {
                        that.Notice('success', 'comment.reportSuccess');
                    } else {
                        that.Notice('fail', 'comment.reportFail');
                    }
                    that.$parent.commentReport = true;
                    that.reportSend = true;
                })
                .catch(err => {
                    console.log(err);
                    that.reportSend = true;
                    that.Notice('fail', 'comment.reportFail');
                });
        }
    }
}
