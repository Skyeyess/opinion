<template>
	<div class="search-container">
		<div class="search-box">
			<i class="mintui mintui-search search"></i>
			<input type="text" v-model="searchText" ref="searchInput" name="search" id="search" :placeholder="$t('common.searchEnter')" @focus="cancelShow = true" @blur="cancelShow = false" @keyup.enter="searchList">
			<i class="iconfont icon-error cancel" @touchend="searchText = ''" v-show="cancelShow && searchText.length !== 0"></i>
			<a class="mint-button" @click="searchList" v-text="$t('common.search')"></a>
		</div>
		<div class="search-list" ref="searchMain" @scroll="searchScroll">
			<load-more
			:news-data="searchData"
			:ref-name="'searchMore'"
			@getList="getList">
			</load-more>
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
			searchText: '',
			searchWord: '',
			searched: 'false',
			cancelShow: true,
			reload: false,
			scrollNum: 0
		}
	},
	computed: {
		...mapState({
			searchData: state => state.search.data
		})
	},
	beforeRouteLeave(to, from, next) {
		const self = this;
		if (to.name !== 'detail') {
			self.reload = true;
			self.searchClear();
			sessionStorage.removeItem('searchWord');
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
		if (self.reload) {
			self.init();
		} else {
			self.$refs.searchMain.scrollTop = self.scrollNum;
		}
	},
	methods: {
		...mapMutations(['searchClear']),
		...mapActions(['searchNews']),
		init() {
			const self = this;
			self.$refs.searchInput.focus();
			self.searchText = '';
			self.searchWord = '';
			self.scrollNum = 0;
			self.state = 'first';
			self.searched = 'false';
			if (sessionStorage.searchWord) {
				self.searchText = sessionStorage.searchWord;
				self.searchWord = sessionStorage.searchWord;
				self.searchList();
			} else {
				self.searchClear();
			}
		},
		searchList() {
			const self = this;
			if (self.cancelShow) {
				self.cancelShow = false;
				document.activeElement.blur();
			}
			if (!self.searchText) {
				return;
			}
			if (self.searchText && self.textInvalid(self.searchText)) {
				self.Notice('fail', 'common.illegalChar');
				// self.$messagebox({
				// 	title: self.$t('common.prompt'),
				// 	message: self.$t('common.illegalChar'),
				// 	confirmButtonText: self.$t('common.ok')
				// });
				return;
			}
			self.Logger('搜索');
			self.state = 'first';
			self.searched = 'true';
			self.searchWord = self.searchText;
			sessionStorage.searchWord = self.searchText;
			self.searchNews(self);
		},
		getList(state) {
			const self = this;
			self.state = state;
			self.searchNews(self);
		},
		searchScroll() {
			const self = this;
			self.scrollNum = self.$refs.searchMain.scrollTop;
		},
		backTop() {
			const self = this;
			if (self.$refs.searchMain.scrollTop > 0) {
				self.$refs.searchMain.scrollTop -= self.$refs.searchMain.offsetHeight / 5;
				requestAnimationFrame(self.backTop);
			}
		}
	}
}
</script>

<style lang="scss">
.search-container {
	height: 100%;
	padding-top: 3.3rem;
	background-color: #f3f7fa;
	.search-box {
		position: fixed;
		z-index: 3;
		top: 1.35rem;
		left: 12%;
		width: 73.6%;
		background-color: #f4f7f8;
		padding: .25rem 0;
		border-radius: .75rem;
		.search {
			position: absolute;
			left: .8rem;
			font-size: .9rem;
			top: 50%;
			margin-top: -0.575rem;
		}
		.cancel {
			display: block;
			width: 1rem;
			height: 1rem;
			text-align: center;
			position: absolute;
			right: 0.5rem;
			background: #9caed3;
			border-radius: 50%;
			color: #fff;
			font-size: .6rem;
			top: 50%;
			z-index: 1;
			margin-top: -0.45rem;
			&:before {
				position: absolute;
				top: 50%;
				left: 50%;
				-webkit-transform: translate(-50%, -50%) scale(0.9);
				transform: translate(-50%, -50%) scale(0.9);
			}
		}
		input[type="text"] {
			display: block;
			padding: 0 0 0 2.3rem;
			width: 85%;
			border: none;
			vertical-align: middle;
			background-color: #f4f7f8;
			transition: all .3s;
			height: 1rem;
			line-height: 1rem;
			font-size: 0.7rem;
			color: #152734;
			border-radius: .75rem;
			-webkit-appearance: none;
			&:focus {
				outline: none;
				-webkit-appearance: none;
				border: none;
			}
			&::-webkit-input-placeholder  {
				color: #C5CEDE;
			}
		}
		.mint-button {
			position: absolute;
			right: -2rem;
			top: 0;
			height: 1.5rem;
			line-height: 1.5rem;
			padding: 0;
			letter-spacing: .05rem;
			font-size: 0.8rem;
			color: #a1b4da;
			border-radius: 0 3px 3px 0;
			background-color: transparent;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			&:active {
				background: transparent;
			}
		}
	}
	.search-list {
		width: 100%;
		height: 100%;
		overflow: auto;
		position: absolute;
		top: 0;
		padding-top: 3.2rem;
		-webkit-overflow-scrolling: touch;
		background-color: #f4f7f9;
	}
}
</style>
