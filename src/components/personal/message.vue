<template>
	<div class="index-container">
		<div class="message-container">
			<div class="all-readed" :class="{'actived': !isArrayRead}" @click="readedAll">全部已读</div>
			<div class="loadmore-scroll" ref="messageMain" @scroll="msgScroll">
				<load-more
				:news-data="messageData" 
				:ref-name="'messageMore'"
				@getList="getList">
					<div slot="main">
						<swipe-list
						:newsData="messageData" 
						:detailTitle="'profile.sensitiveMessage'" 
						:refName="'messageMore'"
						@getList="getList"
						@stopPush="stopPush"
						@readed="readed"
						@getNewsId="getNewsId">
            			</swipe-list>
					</div>
				</load-more>
	        </div>
		</div>
		<i class="goTop bottom-10 iconfont icon-rocket" v-show="scrollNum > rocketShow" @click="backTop()"></i>
	</div>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex';

	export default {
		data() {
			return {
				state: 'first',
				reload: false,
				readId: '',
				scrollNum: 0,
				msgIndex: 0,
				msgObj: null,
				pushUid: null,
				pushSwitch: null,
				isArrayRead: true
			}
		},
		computed: {
	        ...mapState({
	            messageData: state => state.message.messageData,
	            totalPage: state => state.message.totalPage,
	            count: state => state.message.count
	        })
		},
		beforeRouteLeave(to, from, next) {
			const self = this;
			if (to.name !== 'detail') {
				self.reload = true;
			} else {
				self.reload = false;
			}
			next();
		},
		mounted() {
			const self = this;
			self.getMessageList(self);
		},
		activated() {
			const self = this;
			if (self.reload) {
				self.scrollNum = 0;
				self.state = 'first';
				self.getMessageList(self);
			} else {
				self.$refs.messageMain.scrollTop = self.scrollNum;
			}
			self.sendClient({body: true, type: 'loading'});
			self.clearRefresh(self, 'messageMore');
		},
		methods: {
			...mapMutations(['changeCount']),
			...mapActions([
	            'getMessageList',
	            'postReaded',
	            'deleteMessage',
	            'anyMorePush',
	            'readedAllMsg'
	        ]),
			readed(news) {
				const self = this;
				self.changeCount();
				self.sendClient({body: self.count, type: 'badgeCount'});
				self.readId = news.uid;
				self.postReaded(self);
			},
			getNewsId(obj) {
				const self = this;
				self.msgIndex = obj.index;
				self.msgObj = obj.news;
				self.deleteMessage(self);
				self.messageData.list.splice(self.msgIndex, 1);
			},
			stopPush(news) {
				const self = this;
				if (news.isPush) {
					self.pushSwitch = 0;
					news.isPush = 0;
				} else {
					self.pushSwitch = 1;
					news.isPush = 1;
				}
				self.pushUid = news.uid;
				self.anyMorePush(self);
			},
			getList(state) {
				const self = this;
				self.state = state;
				self.getMessageList(self);
			},
			readedAll() {
				const self = this;
				if (self.isArrayRead) {
					self.Logger('全部已读');
					self.readedAllMsg(self);
				}
			},
			msgScroll() {
				const self = this;
				self.scrollNum = self.$refs.messageMain.scrollTop;
			},
			backTop() {
				const self = this;
				if (self.$refs.messageMain.scrollTop > 0) {
					self.$refs.messageMain.scrollTop -= self.$refs.messageMain.offsetHeight / 5;
					requestAnimationFrame(self.backTop);
				}
			}
		}
	}
</script>

<style lang="scss">
	.message-container {
		width: 100%;
		height: calc(100% + 55px);
		.loadmore-scroll {
			width: 100%;
			height: 100%;
			position: absolute;
			overflow: auto;
			top: 0;
			padding-top: 3.7rem;
			padding-bottom: .2rem;
			-webkit-overflow-scrolling: touch;
		}
		.all-readed {
			position: fixed;
			top: 1.6rem;
			right: 0.75rem;
			z-index: 5;
			font-size: .7rem;
			color: #152734;
			&.actived {
				color: #9CA3A9;
			}
		}
	}
</style>
