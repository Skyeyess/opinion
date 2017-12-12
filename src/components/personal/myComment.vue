<template>
	<div class="index-container">
		<div class="my-comment" ref="myCommentMain">
			<load-more :news-data="myCommentList" :ref-name="'myCommentMore'" @getList="getList">
                <div slot="main">
                    <comment-list :commentData="myCommentList" @operate="operate" @reply="reply" @remove="remove" @getList="getList">
                    </comment-list>
                </div>
            </load-more>
		</div>
        <comment-alert :current="'myComment'" :requestData="requestData" :replyMode="replyMode" :commentInput="commentInput" :commentPlace="commentPlace" @sendComment="sendComment"></comment-alert>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {
			state: 'first',
			activeComment: 1,
			commentType: 1,
			commentId: '',
			commentText: '',
			replyId: '',
            replyName: '',
            commentPlace: this.$t('comment.saySomething'),
            commentInput: true,
            commentSend: true,
            title: '',
            likeId: '',
            interval: null,
            textInterval: null,
			replyMode: 0,
			requestData: {}
		}
	},
	activated() {
		const self = this;
		self.state = 'first';
		self.getMyComment(self);
	},
	computed: {
		...mapState({
			myCommentList: state => state.profile.myCommentList
		})
	},
	methods: {
		...mapActions(['getMyComment']),
		operate(comment) {
            const self = this;
            self.myCommentList.list.forEach(item => {
                if (item.id !== comment.id) {
                    item.operate = false;
                }
            });
		},
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
                floorId: comment.id
            }
            self.replyMode = data.eventY;
            self.commentInput = false;
            self.commentPlace = `${self.$t('comment.replyTo')}${self.nameFilter(comment.name, true)}...`;
		},
		remove(comment) {
            const self = this;
            if (comment.deleted) return;
            self.myCommentList.list.forEach(item => {
                if (item.id === comment.id) {
                    item.deleted = true;
                }
            })
		},
		getList(state) {
            const self = this;
            self.state = state;
            self.getMyComment(self);
        },
        sendComment(comment) {
            const self = this;
			self.myCommentList.list.forEach(item => {
				if (item.id === self.requestData.targetId) {
					if (item.replylist.length < 2) {
						item.replylist.push({name: comment.name, content: comment.content});
					}
					item.replyCount += 1;
				}
			})
        }
	}
}
</script>

<style lang="scss">
	.my-comment {
		padding: 3.6rem 0 0;
	    height: 100%;
	    width: 100%;
	    background: #f4f7f9;
	    overflow: auto;
	    position: absolute;
	    top: 0;
        -webkit-overflow-scrolling: touch;
		.comment-user {
			color: #4e87f9;
		}
	}
</style>
