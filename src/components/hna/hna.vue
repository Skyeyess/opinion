<template>
	<div class="hna-wrapper" id="hna-main" @scroll="hnaScroll" v-rocket="{ num: scrollNum, menu: 0 }">
		<div class="hna-subItem-wrapper">
			<mt-swipe :auto="0">
				<mt-swipe-item v-for="(child, index) in hnaItemType" :key="index">
					<div class="hna-subitem" v-for="item in child" :key="item.groupId">
						<router-link :to="{ name: 'hnaNewsList', query: { groupId: item.groupId, title: item.name }}">
							<img :src="item.image" alt="">
							<span>
								<i class="textHidden animated" v-for="(text, index) in item.name" :key="index">{{text}}</i>
							</span>
						</router-link>
					</div>
				</mt-swipe-item>
			</mt-swipe>
		</div>
		<load-more 
		:news-data="newsData"
		:detail-title="'common.hna'" 
		:ref-name="'hnaMore'"
		@getList="getList">
		</load-more>
	</div>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'

export default {
	data() {
		return {
			state: 'first',
			scrollNum: 0
		}
	},
	computed: {
		...mapState({
			hnaItemType: state => state.hna.hnaItemType,
			newsData: state => state.hna.hnaNews
		})
	},
	mounted() {
		const self = this;
		if (localStorage.userName) {
			self.getRoles(self);
		}
		self.getHnaNews(self);
	},
	activated() {
		const self = this;
        self.$el.scrollTop = self.scrollNum;
		self.clearRefresh(self, 'hnaMore');
    },
	methods: {
		...mapActions(['getHnaNews', 'getRoles']),
		getList(state) {
			const self = this;
			self.state = state;
			self.getHnaNews(self);
		},
		hnaScroll() {
			const self = this;
			self.scrollNum = self.$el.scrollTop;
		}
	}
}
</script>
<style lang="scss">
.hna-wrapper {
	padding-top: 3.2rem;
	padding-bottom: 55px;
	overflow: auto;
	height: 100%;
	background: #f4f7f9;
	-webkit-overflow-scrolling: touch;
	border-top: .5px solid #e7edf0;
	.hna-subItem-wrapper {
		margin-bottom: 0.3rem;
		padding: .6rem 0 0;
		background: #fff;
		height: 9.2rem;
		.mint-swipe-item {
            padding: 0 3%;
            font-size: 0;
            text-align: center;
		}
		.hna-subitem {
			position: relative;
			display: inline-block;
			width: 48.5%;
			font-size: 0;
			margin-bottom: .62rem;
			&:nth-child(2) {
				margin-left: 3%;
			}
			> a {
				font-size: 0;
				line-height: 0;
			}
			img {
				width: auto;
				height: 7.3rem;
			}
			span {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				text-align: center;
				line-height: 7.3rem;
				font-size: 0.9rem;
				color: #fff;
				overflow: hidden;
				> i {
					font-style: normal;
					&:nth-child(even) {
						-moz-animation-delay: 1s;
						-webkit-animation-delay: 1s;
						animation-delay: 1s;
					}
				}
			}
		}
		.mint-swipe-indicators{
			bottom: .3rem;
			.mint-swipe-indicator{
				opacity: 1;
				width: .3rem;
				height: .2rem;
				background: #E4EBEF;
				border-radius: .2rem;
				&.is-active{
					width: .8rem;
					background: #4E87F9;
					transition: all .3s ease-in-out;
				}
			}
		}
		.animated {
			-webkit-animation-duration: 2s;
			animation-duration: 2s;
			-moz-animation-delay: 0.6s;
			-webkit-animation-delay: 0.6s;
			animation-delay: 0.6s;
		}
	}
}
@keyframes textHidden {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
.textHidden {
	animation-name: textHidden;
}
</style>
