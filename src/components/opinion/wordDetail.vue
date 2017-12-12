<template>
	<div class="word-container">
		<div class="word-list" ref="wordMain" @scroll="wordScroll">
			<load-more 
			:news-data="wordData" 
			:ref-name="'wordMore'"
			@getList="getList">
				<div slot="header" class="word-chart-container" v-show="wordData.length !== 0">
					<strong class="chart-title">
						<b v-text="searchText"></b>{{$t('opinion.weekVolume')}}</strong>
					<div class="word-chart" id="word-chart"></div>
					<div class="word-chart-info"></div>
				</div>
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
			chart: '',
			searchText: '',
			reload: false,
			scrollNum: 0
		}
	},
	computed: {
		...mapState({
			wordData: state => state.wordDetail.data
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
		self.init();
    },
	activated() {
		const self = this;
		self.clearRefresh(self, 'wordMore');
		if (self.reload) {
			self.init();
		} else {
			self.$refs.wordMain.scrollTop = self.scrollNum;
		}
	},
	methods: {
		...mapActions(['wordChart', 'wordNews']),
		init() {
			const self = this;
			self.state = 'first';
			Object.keys(self.$route.query).forEach(key => {
				self[key] = self.$route.query[key];
			});
            document.getElementById('word-chart').style.width = `${document.body.clientWidth}px`;
			self.chart = self.$echarts.init(document.getElementById('word-chart'));
			setTimeout(() => {
                self.getEleHeight();
            }, 500);
            self.wordChart(self);
            self.wordNews(self);
		},
		getList(state) {
			const self = this;
			self.state = state;
			self.wordNews(self);
		},
		wordScroll() {
			const self = this;
			self.scrollNum = self.$refs.wordMain.scrollTop;
		},
		backTop() {
			const self = this;
			if (self.$refs.wordMain.scrollTop > 0) {
				self.$refs.wordMain.scrollTop -= self.$refs.wordMain.offsetHeight / 5;
				requestAnimationFrame(self.backTop);
			}
		}
	}
}
</script>

<style lang="scss">
.word-container {
	height: 100%;
	padding-top: 3.3rem;
	background-color: #f3f7fa;
	.word-chart-container {
		width: 100%;
		height: 16.75rem;
		background-color: #fff;
		border-bottom: .5px solid #eee;
		margin-bottom: .3rem;
		.chart-title {
			padding: 1.1rem 0 .85rem;
			color: #333;
			display: block;
			font-weight: normal;
			font-size: .7rem;
			text-align: center;
			border-top: 1px solid #f2f2f2;
			b {
				color: #4A84F9;
			}
		}
		.word-chart {
			width: 100%;
			height: 12rem;
			padding: 0 .5rem .5rem;
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
		.word-chart-info {
			padding-bottom: 1.75rem;
		}
	}
	.word-list {
		width: 100%;
		height: 100%;
		overflow: auto;
		top: 0;
		padding-top: 3.2rem;
		position: absolute;
		-webkit-overflow-scrolling: touch;
		background-color: #f4f7f9;
	}
}
</style>
