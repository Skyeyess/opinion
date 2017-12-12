<template>
	<div class="share-container">
		<div class="detail-content" v-show="detail && detailVisible" @scroll="detailScroll" ref="detailMain">
			<h1 class="detail-title">{{ detail.title }}</h1>
			<div class="detail-info clearfix">
				<div class="pull-left">{{ detail.sourceName || detail.source }}</div>
				<div class="pull-left detail-ml">{{ detail.createdAt || dateFormat(detail.publishDate, 'date')}}</div>
			</div>
			<div class="detail-main" v-html="detail.content"></div>
		</div>
		<i class="goTop bottom-10 iconfont icon-rocket" v-show="scrollNum > rocketShow" @click="backTop()"></i>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {
			newsId: '',
			type: '',
			detailVisible: false,
			scrollNum: 0
		}
	},
	computed: {
		...mapState({
			detail: state => state.detail.data
		})
	},
	activated() {
		const self = this;
		self.scrollNum = 0;
		self.newsId = self.$route.query.id;
		self.msgUid = self.$route.query.uid;
		self.type = self.$route.query.type;
		self.$parent.collectId = self.newsId;
		self.checkIscollect(self);
		self.newsDetail(self);
	},
	watch: {
		'detail.content'(newVal) {
			if (newVal) {
				const self = this;
				self.$nextTick(() => {
					const imgArr = document.querySelectorAll('.detail-main img');
					const originalLink = document.querySelector('.detail-main .original-link');
					if (originalLink) {
						originalLink.addEventListener('click', function(e) {
							e.preventDefault();
							if (e.target.innerText) {
								location.href = e.target.innerText;
							}
						})
					}
					if (imgArr) {
						for (let i = 0; i < imgArr.length; i++) {
							if (i > 9) {
								imgArr[i].style.display = 'none';
							} else {
								imgArr[i].onerror = function(e) {
									e.target.style.display = 'none';
								}
							}
						}
					}
				})
			}
		}
	},
	methods: {
		...mapActions(['newsDetail', 'checkIscollect']),
		detailScroll() {
			const self = this;
			self.scrollNum = self.$refs.detailMain.scrollTop;
		},
		backTop() {
			const self = this;
			if (self.$refs.detailMain.scrollTop > 0) {
				self.$refs.detailMain.scrollTop -= self.$refs.detailMain.offsetHeight / 5;
				requestAnimationFrame(self.backTop);
			}
		}
	}
}
</script>

<style lang="scss">
.share-container {
	width: 100%;
	height: 100%;
	background: #f4f7f9;
	.detail-content {
		height: 100%;
	}
}
</style>
