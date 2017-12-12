<template>
	<div class="index-container">
		<div class="colection-container" ref="collectMain" @scroll="collectScroll">
			<load-more 
				:news-data="collectionList" 
				:ref-name="'collectionMore'"
				@getList="getList">
			</load-more>
		</div>
		<i class="goTop bottom-10 iconfont icon-rocket" v-show="scrollNum > rocketShow" @click="backTop()"></i>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex';

	export default {
		data() {
			return {
				state: 'first',
				scrollNum: 0,
				reload: false
			}
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
			self.getCollectionList(self);
		},
		activated() {
			const self = this;
			self.clearRefresh(self, 'collectionMore');
			if (self.reload || self.$parent.isCollection) {
				self.scrollNum = 0;
				self.state = 'first';
				self.getCollectionList(self);
			} else {
				self.$refs.collectMain.scrollTop = self.scrollNum;
			}
		},
		computed: {
			...mapState({
				collectionList: state => state.collection.collectionList
			})
		},
		methods: {
			...mapActions(['getCollectionList']),
			getList(state) {
				const self = this;
				self.state = state;
				self.getCollectionList(self);
			},
			collectScroll() {
				const self = this;
				self.scrollNum = self.$refs.collectMain.scrollTop;
			},
			backTop() {
				const self = this;
				if (self.$refs.collectMain.scrollTop > 0) {
					self.$refs.collectMain.scrollTop -= self.$refs.collectMain.offsetHeight / 5;
					requestAnimationFrame(self.backTop);
				}
			}
		}
	}
</script>

<style lang="scss">
	.colection-container {
		padding: 3.6rem 0 0;
	    height: 100%;
	    width: 100%;
	    background: #f4f7f9;
	    overflow: auto;
	    position: absolute;
	    top: 0;
        -webkit-overflow-scrolling: touch;
	}
</style>
