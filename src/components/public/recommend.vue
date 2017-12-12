<template>
	<div class="index-container" style="background: #fff">
		<div class="top-comment" v-if="detail && detail.id" @click="Logger('评论总数')">
			<router-link :to="{name: 'comment', query: {newsId: detail.id, title: detail.title, targetType: targetType, createTime: detail.createdAt, time: detail.publishDate, source: detail.sourceName || detail.source}}">{{ formatComment(commentCount) }}评论</router-link>
		</div>
		<div class="detail-content" v-show="detail && detailVisible" @scroll="detailScroll" ref="detailMain">
			<div class="detail-interval"></div>
			<h1 class="detail-title">{{ detail.title }}</h1>
			<div class="detail-info clearfix">
				<div class="pull-left">{{ detail.sourceName || detail.source }}</div>
				<div class="pull-left detail-ml">{{ detail.createdAt || dateFormat(detail.publishDate, 'date')}}</div>
			</div>
			<div class="detail-main" v-html="detail.content"></div>
			<div class="about-info" v-show="detail && detail.content && detail.sensitiveLevel > 0 && detail.sensitiveLevel < 4 && detailVisible">
				<div class="info-header"><span class="info-text">{{$t('common.charts')}}</span></div>
				<div class="info-charts">
					<strong class="chart-title">媒体声量走势</strong>
                    	<div class="daily-chart" id="dailyLine"></div>
                    	<div class="daily-chart-info">
                        <!--<div class="dci-content" v-text="commentData.mediaVolume"></div>-->
                    </div>
					<strong class="chart-title">媒体报道属性分析</strong>
                    	<div class="daily-chart" id="dailyHollow"></div>
                    	<div class="daily-chart-info">* 图表仅展示七日内的数据</div>
				</div>
			</div>
			<div class="about-info" v-show="detail && detail.content && detailVisible && aboutInfoList && aboutInfoList.list.length">
				<div class="info-header"><span class="info-text">{{$t('common.relate')}}</span></div>
				<news-list :news-data="aboutInfoList" :detail-title="$route.query.title">
					<div slot="none"></div>
				</news-list>
			</div>
		</div>
		<div class="comment-box" v-show="commentInput && detail && detail.id">
			<div class="comment-input" @click="showTextarea()">
				{{$t('comment.saySomething')}}
			</div>
			<router-link class="comment-link" :to="{name: 'comment', query: {newsId: detail.id, title: detail.title, targetType: targetType, createTime: detail.createdAt, time: detail.publishDate, source: detail.sourceName || detail.source}}"><span @click="Logger('评论图标')"><i class="iconfont icon-message"></i>{{ formatComment(commentCount) }}</span></router-link>
			<i class="iconfont" :class="{'icon-collection': isCollection, 'icon-collection_fill': !isCollection}" v-show="$route.name === 'recommend'" @click="collection(),Logger('收藏')"></i>
			<i class="iconfont icon-share" @click="shareNews(),Logger('分享')"></i>
		</div>
		<comment-alert :current="'recommend'" :requestData="requestData" :commentInput="commentInput" :commentPlace="$t('comment.saySomething')" @sendComment="sendComment"></comment-alert>
		<div class="detail-none" v-show="detail && !detailVisible" v-text="$t('common.dataDeleted')"></div>
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
			detailVisible: true,
			scrollNum: 0,
			commentText: '',
			commentInput: true,
			isCollection: 1,
			commentType: 0,
			tags: '',
			showSensitive: true,
			windInfo: 'Wind资讯',
			detailTitle: '',
			wind: true,
			detailType: '',
			aboutType: '',
			interval: null,
			charts: {},
			requestData: {}
		}
	},
	computed: {
		targetType() {
			const self = this;
			return (self.type === 'opinion' || self.type === 'message') ? 1 : 0;
		},
		title() {
			const self = this;
			return self.detail.title;
		},
		...mapState({
			detail: state => state.detail.data,
			aboutInfoList: state => state.detail.aboutInfoList,
			token: state => state.login.token,
			commentCount: state => state.comment.commentCount
		})
	},
	mounted() {
		const self = this;
		document.querySelector('.comment-input').addEventListener('click', () => {
			document.querySelector('.text-box').focus();
		});
		const chartsEle = document.querySelectorAll('.daily-chart');
        for (let i = 0; i < chartsEle.length; i++) {
            chartsEle[i].style.width = `${document.body.clientWidth}px`;
            let chartId = chartsEle[i].id;
            self.charts[chartId] = self.$echarts.init(document.getElementById(chartId));
        }
	},
	activated() {
		const self = this;
		self.scrollNum = 0;
		self.detailVisible = true;
		self.newsId = self.$route.query.id;
		self.msgUid = self.$route.query.uid;
		self.type = self.$route.query.type;
		self.tags = self.$route.query.tags;
		self.checkIscollect(self);
		if (self.type === 'opinion') {
			self.$parent.selected = self.$t('common.opinion');
		} else {
			self.$parent.selected = self.$t('common.index');
		}
		if (self.$route.query.title) {
			self.$parent.selected = self.$t(self.$route.query.title);
		}
		self.newsDetail(self);
		self.getCommentCount(self);
	},
	watch: {
		'detail.content'(newVal) {
			if (newVal) {
				const self = this;
				self.$nextTick(() => {
					const imgArr = document.querySelectorAll('.detail-main img');
					const originalLink = document.querySelector('.detail-main .original-link');
					if (originalLink) {
						const tooltipLeft = document.querySelector('.tooltip-left') || document.createElement('div');
						if (!localStorage.detailTip) {
							const tooltipText = document.querySelector('.tooltip-text') || document.createElement('span');
							const tooltipClose = document.querySelector('.tooltip-close') || document.createElement('img');
							tooltipLeft.className = 'tooltip-left';
							tooltipText.className = 'tooltip-text';
							tooltipText.innerText = '这里增加了原文链接';
							tooltipClose.className = 'tooltip-close';
							tooltipClose.src = `${self.imgBase}pop_close.png`;
							tooltipLeft.appendChild(tooltipText);
							tooltipLeft.appendChild(tooltipClose);
							originalLink.parentNode.style.position = 'relative';
							if (!document.querySelector('.tooltip-left')) {
								originalLink.parentNode.appendChild(tooltipLeft);
							}
							tooltipClose.addEventListener('click', function(e) {
								tooltipLeft.style.display = 'none';
								localStorage.detailTip = 'true';
							});
						}
						originalLink.addEventListener('click', function(e) {
							if (self.$route.name === 'detail') return;
							tooltipLeft.style.display = 'none';
							localStorage.detailTip = 'true';
							e.preventDefault();
							if (e.target.innerText) {
								if (localStorage.loginType === 'bim') {
									location.href = e.target.innerText
								} else {
									self.sendClient({type: 'link', body: e.target.innerText});
								}
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
		...mapActions(['newsDetail', 'checkIscollect', 'confirmCollection', 'cancelCollection', 'getCommentCount', 'getAboutInfo', 'getDetailCharts']),
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
		},
		shareNews() {
			const self = this;
			if (!self.token) {
				self.loginAuth(self, `${self.$route.name}?${self.newsId}`);
				return
			}
            const sendObj = { body: location.href.replace('#/recommend', '#/share'), title: self.detail.title, icon: `${self.imgBase}about_icon@3x.png`, type: 'share' }
			if (self.detail.content) {
				sendObj.content = self.detail.content.replace(/<[^>]*>/g, '').substring(0, 100);
			} else {
				sendObj.content = '';
			}
			self.sendClient(sendObj);
        },
		collection() {
			const self = this;
			if (!self.token) {
				self.loginAuth(self, `${self.$route.name}?${self.newsId}`);
				return
			}
            if (self.isCollection) {
                self.confirmCollection(self);
            } else {
                self.cancelCollection(self);
            }
            self.isCollection = !self.isCollection;
        },
        showTextarea() {
			const self = this;
			if (!self.token) {
				self.loginAuth(self, `${self.$route.name}?${self.newsId}`);
				return
			}
            self.requestData = {
                targetId: self.newsId,
                replyUserName: '',
                title: self.detail.title,
                commentType: 0,
                userName: localStorage.userName,
                content: '',
                targetType: self.targetType,
                floorId: ''
            }
            self.commentInput = false;
        },
		sendComment() {
			const self = this;
			self.getCommentCount(self);
		}
	}
}
</script>

<style lang="scss">
@import '../../assets/common.scss';
.tooltip-left {
    position: absolute;
    top: -1rem;
    left: 5.2em;
    width: 8.9rem !important;
    height: 2.25rem !important;
    background: url(#{$imgBase}pop_left.png) no-repeat;
    background-size: 100% 100%;
    z-index: 20;
    .tooltip-text {
        display: inline-block;
        color: #fff;
        font-size: 0.7rem;
        line-height: 1rem;
        padding: 0.45rem 0 0.8rem 0.75rem;
    }
    .tooltip-close {
        position: absolute;
        height: 1.9rem;
        top: 0;
        right: 0;
    }
}
.comment-modal {
	z-index: 99;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
}
.index-container {
	.mint-popup {
		background: none;
	}
	> .v-modal {
        background: transparent;
    }
    .top-comment {
    	width: 3.4rem;
    	height: 1.2rem;
    	background: url(#{$imgBase}comment-count.svg) 0 0 no-repeat;
    	background-size: 100% 100%;
    	position: fixed;
    	top: 1.45rem;
    	right: 10px;
    	z-index: 10;
    	text-align: center;
    	font-size: .5rem;
    	display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        align-items: center;
		> a {
            text-align: center;
	    	color: #fff;
			text-align: center;
			margin-top: .2rem;
		}
	}
}
.index-container {
	.comment-alert {
		width: 100%;
		position: fixed;
		z-index: 100;
		bottom: 0;
		left: 0;
		right: 0;
		line-height: 0;
		padding: 0 0.5rem 0.5rem;
		background: #fff;
		.max-text {
			height: 1rem;
			line-height: normal;
			text-align: right;
			font-size: .7rem;
			color: #A1B4DA;
			background: #F4F7F8;
			padding-right: .5rem;
			position: absolute;
            width: calc(100% - 1rem);
            width: -webkit-calc(100% - 1rem);
            right: .5rem;
            top: 6.2rem;
		}
		.opt-btn {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-justify-content: space-between;
		    justify-content: space-between;
		    height: 2.2rem;
		    font-size: .7rem;
		    color: #152734;
		    .opt-cancel, .opt-publish {
		    	height: 100%;
		    	line-height: 2.2rem;
		    }
		    .opt-publish {
		    	color: #A1B4DA;
		    }
		    .publish-active {
		    	color: #4E87F9;
		    }
		    .opt-title {
		    	font-size: .8rem;
				color: #152734;
				line-height: 2.2rem;
		    }
		}
		.text-box {
			padding: .5rem;
			padding-bottom: 1rem;
			width: 100%;
			resize: none;
			height: 5rem;
			border: none;
			color: #152734;
			font-size: .7rem;
			background: #F4F7F8;
			&::-webkit-input-placeholder  {
				color: #A1B4DA;
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
		padding: 0.5rem;
		height: 55px;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-justify-content: space-between;
	    justify-content: space-between;
	    -webkit-align-items: center;
	    align-items: center;
	    border-top: 1px solid rgba(161,180,218,0.30);
	    > a {
	    	display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-align-items: center;
	    	align-items: center;
	    }
		.icon-collection, .icon-collection_fill {
            font-size: 1rem;
        }
        .icon-collection_fill {
            color: #4f84ef;
        }
        .icon-share {
            font-size: 1rem;
        }
        .icon-message {
        	font-size: 1rem;
        	vertical-align: middle;
        	margin-right: 0.2rem;
        }
		.comment-input {
			background: #F4F7F8;
			border-radius: 1.85rem;
			color: #C1CADC;
			border: none;
			font-size: .7rem;
			padding: 5px 0 5px 10px;
			width: 60%;
			&:focus {
				outline: none;
			}
		}
		.comment-link {
			color: #4E87F9;
		}
	}
}
</style>
