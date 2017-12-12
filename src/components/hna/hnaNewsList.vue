<template>
	<div class="hnaItem-wrapper" @scroll="hnaItemScroll">
		<load-more 
		:news-data="newsData" 
		:detail-title="$route.query.title" 
		:ref-name="'hnaItemMore'"
		@getList="getList">
		</load-more>
		<i class="goTop bottom-10 iconfont icon-rocket" v-show="scrollNum > rocketShow" @click="backTop()"></i>
	</div>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'

export default {
	data() {
		return {
			state: 'first',
			scrollNum: 0,
			groupId: '',
			reload: false
		}
	},
	computed: {
		...mapState({
			newsData: state => state.hna.hnaItemNews
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
		if (self.$route.query.groupId) {
			self.groupId = self.$route.query.groupId;
		}
		self.getHnaItemNews(self);
	},
	activated() {
		const self = this;
		self.clearRefresh(self, 'hnaItemMore');
		self.$parent.selected = self.$route.query.title;
		if (self.reload) {
			self.groupId = self.$route.query.groupId;
			self.state = 'first';
			self.getHnaItemNews(self);
		} else {
			self.$el.scrollTop = self.scrollNum;
		}
    },
	methods: {
		...mapActions(['getHnaItemNews']),
		getList(state) {
			const self = this;
			self.state = state;
			self.getHnaItemNews(self);
		},
		hnaItemScroll() {
			const self = this;
			self.scrollNum = self.$el.scrollTop;
		},
		backTop() {
			const self = this;
			if (self.$el.scrollTop > 0) {
				self.$el.scrollTop -= self.$el.offsetHeight / 5;
				requestAnimationFrame(self.backTop);
			}
		}
	}
}
</script>
<style lang="scss">
.hnaItem-wrapper {
	padding-top: 3.3rem;
	overflow: auto;
	height: 100%;
	background: #f4f7f9;
	-webkit-overflow-scrolling: touch;
}
</style>
