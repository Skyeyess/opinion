<template>
    <div class="comment-container" ref="commentMain">
        <div class="comment-main">
            <load-more :news-data="commentList" :ref-name="'commentMore'" @getList="getList">
                <div slot="header">
                    <div class="comment-top">
                        <h1 class="comment-title" v-text="urlData.title"></h1>
                        <div class="comment-info">
                            <em class="comment-source" v-text="urlData.source"></em>
                            <em class="comment-time" v-text="dateFormat(urlData.time) || urlData.createTime"></em>
                        </div>
                    </div>
                    <div class="comment-all" v-show="commentCount && commentHot.total" v-text="$t('comment.hot')"></div>
                    <div class="comment-hot">
                        <comment-item v-for="(comment, index) of commentHot.list" :key="comment.id" :comment="comment" @reply="reply" @remove="remove" @report="report"></comment-item>
                    </div>
                    <div class="comment-all" v-show="commentCount">{{$t('comment.all')}} {{commentCount}}</div>
                </div>
                <div slot="main">
                    <comment-list :commentData="commentList" @reply="reply" @remove="remove" @report="report" @getList="getList"></comment-list>
                </div>
            </load-more>
            <div class="comment-box" v-show="commentInput">
                <div class="comment-input" @click="showCommentInput()" v-text="$t('comment.saySomething')"></div>
            </div>
            <comment-alert :current="'comment'" :requestData="requestData" :commentInput="commentInput" :replyMode="replyMode" :commentPlace="commentPlace" @sendComment="sendComment"></comment-alert>
        </div>
        <report-comment v-if="!commentReport"></report-comment>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
    data() {
        return {
            state: 'first',
            newsId: '',
            urlData: '',
            targetType: '',
            commentText: '',
            requestData: {},
            commentSend: true,
            commentInput: true,
            commentReport: true,
            commentType: 0,
            plusCount: 0,
            lessId: [],
            commentId: '',
            commentPlace: this.$t('comment.saySomething'),
            replyId: '',
            replyName: '',
            likeId: '',
            currentUser: localStorage.userName,
            interval: null,
            replyMode: 0,
            reportData: null,
            activeComment: 1
        }
    },
    computed: {
        ...mapState({
            commentData: state => state.comment.commentData,
            commentHot: state => state.comment.commentHot,
            commentList: state => state.comment.commentList,
            commentCount: state => state.comment.commentCount
        })
    },
    activated() {
        const self = this;
        self.newsId = self.$route.query.newsId;
        self.title = self.$route.query.title;
        self.targetType = self.$route.query.targetType;
        if (Object.keys(self.$route.query).length) {
            self.urlData = self.$route.query;
        } else {
            self.urlData = self.commentData;
        }
        self.getCommentCount(self);
        self.getCommentHot(self);
        self.getCommentList(self);
    },
    methods: {
        ...mapMutations(['countLess', 'countPlus']),
        ...mapActions(['getCommentList', 'getCommentCount', 'getCommentHot']),
        // operate(comment) {
        //     const self = this;
        //     self.commentList.list.forEach(item => {
        //         if (item.id !== comment.id) {
        //             item.operate = false;
        //         }
        //     })
        //     self.commentHot.list.forEach(item => {
        //         item.operate = false;
        //     })
        // },
        // operateHot(comment) {
        //     const self = this;
        //     self.commentHot.list.forEach(item => {
        //         if (item.id !== comment.id) {
        //             item.operate = false;
        //         }
        //     })
        //     self.commentList.list.forEach(item => {
        //         item.operate = false;
        //     })
        // },
        reply(data) {
            const self = this;
            const comment = data.comment;
            self.requestData = {
                targetId: comment.id,
                replyUserName: comment.userName,
                title: self.title,
                commentType: 1,
                userName: localStorage.userName,
                content: '',
                targetType: self.targetType,
                floorId: comment.id
            }
            self.replyMode = data.eventY;
            self.commentInput = false;
            self.commentPlace = `${self.$t('comment.replyTo')}${self.nameFilter(comment.name, true)}...`;
        },
        remove(comment) {
            const self = this;
            if (comment.deleted) return;
            self.commentList.list.forEach(item => {
                if (item.id === comment.id) {
                    item.deleted = true;
                }
            })
            self.commentHot.list.forEach(item => {
                if (item.id === comment.id) {
                    item.deleted = true;
                }
            })
            self.countLess();
        },
        report(comment) {
            const self = this;
            self.reportData = comment;
            self.commentId = comment.id;
            self.commentReport = false;
        },
        getList(state) {
            const self = this;
            self.state = state;
            if (state === 'refresh') {
                self.getCommentCount(self);
                self.getCommentHot(self);
            }
            self.getCommentList(self);
        },
        showCommentInput() {
            const self = this;
            self.requestData = {
                targetId: self.newsId,
                replyUserName: '',
                title: self.title,
                commentType: 0,
                userName: localStorage.userName,
                content: '',
                targetType: self.targetType,
                floorId: ''
            }
            self.commentPlace = self.$t('comment.saySomething');
            self.commentInput = false;
        },
        sendComment(comment) {
            const self = this;
            if (!comment.detailType) return;
            comment.detailType = null;
            self.plusCount += 1;
            if (self.requestData.commentType) {
                self.commentList.list.forEach(item => {
                    if (item.id === self.requestData.targetId) {
                        if (item.replylist.length < 2) {
                            item.replylist.push({ name: comment.name, content: comment.content });
                        }
                        item.replyCount += 1;
                    }
                })
                self.commentHot.list.forEach(item => {
                    if (item.id === self.requestData.targetId) {
                        if (item.replylist.length < 2) {
                            item.replylist.push({ name: comment.name, content: comment.content });
                        }
                        item.replyCount += 1;
                    }
                })
            } else {
                self.commentList.list.unshift(comment);
                self.countPlus();
                self.$el.scrollTop = 0;
                self.lessId.push(self.commentList.list[self.commentList.list.length - self.plusCount].id);
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/common.scss';
.comment-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 3.3rem;
    padding-bottom: 50px;
    background-color: #f3f7fa;
    .comment-all {
        font-size: 0.8rem;
        line-height: 1rem;
        color: #4e87f9;
        font-weight: bold;
        padding: 0.75rem 0.85rem 0.2rem .8rem;
    }
    .comment-box {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 10;
        background: #fff;
        padding: 10px;
        height: 55px;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        -webkit-align-items: center;
        align-items: center;
        border-top: 1px solid rgba(161, 180, 218, 0.30);
        .comment-input {
            background: #F4F7F8;
            border-radius: 1.85rem;
            color: #C1CADC;
            border: none;
            font-size: .7rem;
            padding: 5px 0 5px 10px;
            width: 100%;
            &:focus {
                outline: none;
            }
        }
    }
    .comment-main {
        background-color: #fff;
        .comment-top {
            padding: .7rem .8rem .85rem .85rem; // height: 4.35rem;
            margin-top: 0.3rem;
            border-bottom: 1px solid #eee;
            .comment-title {
                font-size: 1rem;
                line-height: 1.3rem;
                color: #152734;
            }
            .comment-info {
                margin-top: 0.9rem;
                font-size: 0.6rem;
                line-height: 0.6rem;
                color: #a1b4da;
                .comment-source {
                    margin-right: 1rem;
                }
            }
        }
    }
}
</style>
