<template>
	<div class="news-container" @scroll="newsScroll">
		<div class="opinion-navbar" v-if="hollowShow">
			<a v-for="(type, index) in hollowList" :key="index" :class="{'router-link-active': hollowType === type}" @click="hollowType = type" v-text="type"></a>
		</div>
		<load-more
		:class="{'has-margin': hollowShow}" 
		:news-data="newsData" 
		:ref-name="'chartListMore'"
		@getList="getList">
		</load-more>
		<i class="goTop bottom-10 iconfont icon-rocket" v-show="scrollNum > rocketShow" @click="backTop()"></i>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {
			state: 'first',
			chart: '',
			routeData: '',
			scrollNum: 0,
			hollowShow: true,
			hollowCurrent: '',
			reload: false
		}
	},
	computed: {
		hollowType: {
			get() {
				const self = this;
				return self.hollowCurrent || self.hollowList[0]
			},
			set(type) {
				const self = this;
				self.hollowCurrent = type;
			}
		},
		...mapState({
			hollowList: state => state.chartDetail.hollowList,
			newsData: state => state.chartDetail.data
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
		self.routeData = self.$route.query;
		if (self.routeData.currentDate) {
				if ('keyword' in self.routeData) {
					self.Logger('special-line');
				}
			}
			if (self.routeData.companyName) {
				if (!(('keyword' in self.routeData))) {
					self.Logger('report-bar');
				}
			}
			if (self.routeData.mediaType) {
				if (!('keyword' in self.routeData)) {
					self.Logger('report-hollow');
				} else {
					self.Logger('special-hollow');
				}
			}
			if ('sensitive' in self.routeData) {
				if (!('keyword' in self.routeData)) {
					self.Logger('report-pie');
				} else {
					self.Logger('special-pie');
				}
			}
		self.hollowShow = false;
		if (self.routeData && self.routeData.cultureLabel) {
			self.Logger('report-radar');
			self.Logger(self.hollowType);
			self.hollowShow = true;
			self.routeData.cultureLabel = self.hollowType;
		}
		self.chartNews(self);
	},
	activated() {
		const self = this;
		self.clearRefresh(self, 'chartListMore');
		self.$el.scrollTop = self.scrollNum;
		if (self.reload) {
			self.hollowShow = false;
			self.hollowCurrent = '';
			self.state = 'first';
			self.routeData = self.$route.query;
			if (self.routeData.currentDate) {
				if ('keyword' in self.routeData) {
					self.Logger('special-line');
				}
			}
			if (self.routeData.companyName) {
				if (!('keyword' in self.routeData)) {
					self.Logger('report-bar');
				}
			}
			if (self.routeData.mediaType) {
				if (!('keyword' in self.routeData)) {
					self.Logger('report-hollow');
				} else {
					self.Logger('special-hollow');
				}
			}
			if ('sensitive' in self.routeData) {
				if (!('keyword' in self.routeData)) {
					self.Logger('report-pie');
				} else {
					self.Logger('special-pie');
				}
			}
			if (self.routeData && self.routeData.cultureLabel) {
				self.Logger('report-radar');
				self.Logger(self.hollowType);
				self.hollowShow = true;
				self.routeData.cultureLabel = self.hollowType;
			}
			setTimeout(() => {
                self.getEleHeight();
            }, 500);
			self.chartNews(self);
		}
	},
	watch: {
		hollowType (newValue, oldValue) {
			const self = this;
			if (newValue) {
				self.Logger(self.hollowType);
			}
			if (newValue !== oldValue) {
				self.routeData.cultureLabel = self.hollowType;
				self.state = 'first';
				self.$el.scrollTop = 0;
				self.chartNews(self);
			}
		}
	},
	methods: {
		...mapActions(['chartNews']),
		getList(state) {
			const self = this;
			self.state = state;
			self.chartNews(self);
		},
		newsScroll() {
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
.news-container {
	position: absolute;
	padding-top: 3.2rem;
	height: 100%;
	width: 100%;
	overflow: auto;
	-webkit-overflow-scrolling: touch;
	background-color: #F4F7F9;
	.opinion-navbar {
		position: fixed;
		width: 100%;
		z-index: 222;
		a:after {
			content: '';
			position: absolute;
			bottom: -.3rem;
			left: 0;
			width: 100%;
			height: 0.3rem;
			background-color: #f4f7f9;
		}
	}
	.has-margin {
		margin-top: 2.7rem;
	}
}
</style>
