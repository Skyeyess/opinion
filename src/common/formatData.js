export default (that, result, oldData) => {  // that: 当前vue实例 result: 接口返回数据, oldData: state里的旧数据
    oldData.status = false;
    oldData.loading = false;   // 数据是否加载成功
    const newsData = result.entries || result.infoList || result.lists || result.rows;  // 获取列表数据
    const totalPage = result.totalPage || result.totalPages;  // 总页数
    // 下拉刷新时操作
    if (oldData.refresh) {
        oldData.list = [];
        const topLoad = function () {
            oldData.refresh = false;
            const refreshEle = document.querySelector('.mint-loadmore-top');
            if (refreshEle) {
                refreshEle.style.backgroundImage = '';
            }
            Object.keys(that.$refs).forEach(refName => {
                if (that.$refs[refName].onTopLoaded) {
                    that.$refs[refName].onTopLoaded();
                }
            });
        }
        if (sessionStorage.refreshTime && new Date().getTime() - sessionStorage.refreshTime < that.refreshInterval) {
            setTimeout(function () {
                topLoad();
            }, that.refreshInterval - (new Date().getTime() - sessionStorage.refreshTime))
        } else {
            topLoad();
        }
    }
    // 上拉加载更多时操作
    if (oldData.next) {
        oldData.next = false;
        Object.keys(that.$refs).forEach(refName => {
            if (that.$refs[refName].onBottomLoaded) {
                that.$refs[refName].onBottomLoaded();
            }
        });
    }
    // 列表翻到最后一页时
    if (oldData.page >= totalPage || totalPage <= 1 || !totalPage) {
        oldData.end = true;
    }
    if (newsData.length && 'hnaType' in newsData[0]) {
        oldData.type = 'insight';
        newsData.forEach((item, index) => {
            if (item.id) {
                if (oldData.list.some(repeat => repeat.id === item.id)) return;
                let current = {
                    id: item.id,
                    url: null,
                    title: that.characters(item.title, 30),
                    image: `${location.origin}/pdfs/${item.newImageFilename}`,
                    time: that.dateFormat(item.publishDate, 'monthDate'),
                    author: item.author,
                    source: item.source
                };
                if (item.hnaContentType === '1') {
                    current.content = item.hnaContent;
                } else {
                    current.icon = `${that.imgBase}icon_pdf.png`;
                    current.url = `${location.origin}/pdfs/${item.newFilename}`;
                }
                oldData.list.push(current);
            }
        });
    } else if (newsData.length && !newsData[0].targetId) {
        oldData.type = 'news';
        newsData.forEach((news, index) => {
            if (news.id) {
                let current = {
                    id: news.id,
                    uid: news.uid || '',
                    tags: news.tags || '',
                    commentCount: 0,
                    title: that.characters(news.title, 40, null, oldData.highLight),
                    time: that.dateFormat(news.formatDate || news.publishDate, 'monthDate'),
                    source: that.characters(news.source || news.sourceName, 6, null)
                };
                Object.keys(result.countMap || {}).forEach(key => {
                    if (news.id === key) {
                        current.commentCount = that.formatComment(result.countMap[key]);
                    }
                });
                if ('isPush' in news) {
                    current.isPush = news.isPush;
                    current.isRead = news.isRead;
                } else {
                    if (!news.isRead) {
                        current.isRead = 0;
                    }
                }
                if (news.searchCompany) {
                    switch (news.sensitiveLevel) {
                        case 1:
                            current.sensitive = 'common.sensitive';
                            current.sensitiveColor = 'gold';
                            break;
                        case 2:
                            current.sensitive = 'common.keynoteSensitive';
                            current.sensitiveColor = 'orange';
                            break;
                        case 3:
                            current.sensitive = 'common.seriousSensitive';
                            current.sensitiveColor = 'red';
                            break;
                        default:
                            current.sensitive = false;
                            break;
                    }
                    current.detailType = 'opinion';
                    current.detailTitle = 'common.opinion';
                    current.company = that.filterCharacter(news.searchCompany);
                } else {
                    current.sensitive = false;
                    current.detailType = '';
                    current.detailTitle = 'common.index';
                    current.company = null;
                    if (news.mediaType === '5' || news.pubType === '5') {
                        if (news.mediaName === 'Wind资讯') {
                            current.company = 'common.haveWind';
                        } else {
                            current.company = 'common.fromWind';
                        }
                    }
                }
                oldData.list.push(current);
            }
        });
    } else {
        oldData.type = 'comment';
        if (result.first) {
            newsData.unshift(result.first);
        }
        newsData.forEach((comment, index) => {
            if (oldData.page > 1 && that.lessId && that.lessId.includes(comment.id)) return;
            if (comment.id) {
                let current = {
                    id: comment.id || '',
                    name: comment.name,
                    content: comment.content || '',
                    userName: comment.userName || '',
                    // operate: false,
                    laud: false,
                    deleted: false,
                    replyCount: 0,
                    replylist: [],
                    isLike: comment.isLike,
                    title: comment.title,
                    targetId: comment.targetId,
                    like: comment.likeCount || 0,
                    self: localStorage.userName === comment.userName,
                    photo: comment.empPhoto || `${that.imgBase}icon-personal.png`,
                    time: that.dateFormat(comment.updateTime, 'simple')
                }
                if (!('info' in result)) {
                    current.detailType = comment.targetType ? 'opinion' : 'index';
                }
                if (comment.repName && comment.targetId !== comment.floorId) {
                    current.content = `${comment.content}//<em>@${comment.repName}: </em>${comment.repContent}`;
                }
                if (result.replyCommentMap) {
                    Object.keys(result.replyCommentMap).forEach(key => {
                        if (comment.id === Number(key)) {
                            result.replyCommentMap[key].forEach((reply, replyIndex) => {
                                if (replyIndex > 1) return;
                                let replyContent = reply.content;
                                if (reply.repName && reply.targetId !== reply.floorId) {
                                    replyContent = `${reply.content}//<em>@${reply.repName}: </em>${reply.repContent}`;
                                }
                                if (reply.id) {
                                    current.replylist.push({
                                        name: reply.name,
                                        content: replyContent
                                    });
                                }
                            })
                        }
                    });
                }
                if (result.countReplayMap) {
                    Object.keys(result.countReplayMap).forEach(key => {
                        if (comment.id === Number(key)) {
                            current.replyCount = result.countReplayMap[key];
                        }
                    });
                }
                oldData.list.push(current);
            }
        });
        if (that.lessId) {
            that.lessId = [];
            if (that.plusCount) {
                that.plusCount = 0;
            }
        }
    }
    //  第一次加载或者翻页时的数据返回
    if (oldData.list.length) {
        oldData.total = oldData.list.length
    } else {
        oldData.status = true;
        oldData.none = true;
    }
    return oldData;
}
