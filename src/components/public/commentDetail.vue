<template>
    <div class="comment-container cc-detail">
        <div class="comment-main">
            <load-more :news-data="replyList" :ref-name="'replyMore'" @getList="getList">
                <div slot="main">
                    <comment-list :commentData="replyList" @reply="reply" @remove="remove" @report="report" @getList="getList"></comment-list>
                </div>
            </load-more>
            <div class="comment-box" v-show="commentInput">
                <div class="comment-input" @click="replyMode = 0, showCommentInput()">
                    {{$t('comment.replyTo')}}{{replyList.list[0] && replyList.list[0].userName}}...
                </div>
            </div>
            <comment-alert :current="'commentDetail'" :requestData="requestData" :replyMode="replyMode" :commentInput="commentInput" :commentPlace="commentPlace" @sendComment="sendComment"></comment-alert>
        </div>
        <report-comment v-if="!commentReport"></report-comment>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    data() {
        return {
            state: 'first',
            newsId: '',
            title: '',
            targetType: '',
            commentText: '',
            commentId: '',
            commentSend: true,
            commentInput: true,
            commentReport: true,
            commentPlace: '',
            likeId: '',
            replyId: '',
            replyName: '',
            commonId: '',
            currentUser: localStorage.userName,
            interval: null,
            replyMode: 0,
            lessId: [],
            requestData: {}
        }
    },
    computed: {
        floorId() {
            const self = this;
            return self.replyList.list[0].id;
        },
        ...mapState({
            replyList: state => state.comment.replyList
        })
    },
    activated() {
        const self = this;
        self.newsId = self.$route.query.newsId;
        self.commonId = self.$route.query.commonId;
        self.state = 'first';
        self.getReplyList(self);
    },
    methods: {
        ...mapActions(['getReplyList']),
        // operate(comment) {
        //     const self = this;
        //     self.replyList.list.forEach(item => {
        //         if (item.id !== comment.id) {
        //             item.operate = false;
        //         }
        //     });
        // },
        reply(data) {
            const self = this;
            const comment = data.comment;
            self.requestData = {
                targetId: comment.id,
                replyUserName: comment.userName,
                title: comment.title,
                commentType: 1,
                userName: localStorage.userName,
                content: '',
                targetType: comment.targetType,
                floorId: self.replyList.list[0].id
            }
            self.replyMode = data.eventY;
            self.commentInput = false;
            self.commentPlace = `${self.$t('comment.replyTo')}${self.nameFilter(comment.name, true)}...`;
        },
        remove(comment) {
            const self = this;
            if (comment.deleted) return;
            self.replyList.list.forEach(item => {
                if (item.id === comment.id) {
                    item.deleted = true;
                    if (comment.id === self.replyList.list[0].id) {
                        self.$router.go(-1);
                    }
                }
            })
        },
        report(comment) {
            const self = this;
            self.commentId = comment.id;
            self.commentReport = false;
        },
        getList(state) {
            const self = this;
            self.state = state;
            self.getReplyList(self);
        },
        showCommentInput() {
            const self = this;
            self.requestData = {
                targetId: self.replyList.list[0].id,
                replyUserName: self.replyList.list[0].userName,
                title: self.replyList.list[0].title,
                commentType: 1,
                userName: localStorage.userName,
                content: '',
                targetType: self.replyList.list[0].targetType,
                floorId: self.replyList.list[0].id
            }
            self.commentInput = false;
            self.commentPlace = `${self.$t('comment.replyTo')}${self.nameFilter(self.replyList.list[0].userName, true)}...`;
        },
        sendComment(comment) {
            const self = this;
            if (!comment.detailType) return;
            comment.detailType = null;
            self.replyList.list.splice(1, 0, comment);
            self.lessId.push(comment.id);
            self.$el.scrollTop = 0;
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/common.scss';
.cc-detail {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 3.3rem;
    padding-bottom: 50px;
    background-color: #f3f7fa;
    .comment-item {
        &:not(:nth-child(2)) {
            background-color: #f4f7f8;
            .cd-top {
                height: auto;
                .comment-user {
                    width: 10rem;
                    color: #4E87F9;
                    word-break: break-all;
                    em {
                        color: #051C2D;
                    }
                }
            }
        }
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
    }
}
</style>
