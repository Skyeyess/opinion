<template>
	<div class="index-container">
		<div class="keyword-edit" v-if="subjectArr.length !== 0" @click="editShow()">{{editTopText}}</div>
		<div class="keywords-container" v-if="subjectArr.length !== 0">
			<div class="keywords-box" v-for="(item, index) in subjectArr" :key="item.id">
				<dl class="clearfix">
					<dt class="pull-left">{{item.subjectName}}</dt>
					<dd class="pull-right open" v-show="!editVisible" @click="showAll(index)">{{ $t('opinion.all') }}<i class="iconfont icon-arrow-down line-height-1 pull-right" :class="{'list-icon': index === tabIndex}"></i></dd>
					<dd class="pull-right edit-key" v-show="editVisible">
						<div class="inline-block">
							<router-link :to="{name: 'addKeywords', params: {id: item.id}}">
								<b class="iconfont icon-edit"></b>{{ $t("common.edit") }}
							</router-link>
						</div>
						<div class="inline-block" @click="deleteKey(index, item)"><b class="iconfont icon-delete"></b>{{ $t("common.delete") }}</div>
					</dd>
				</dl>
				<dl class="clearfix show-list" :class="{'list-all': index === tabIndex}">
					<dd>
						<span v-for="(key, index) in keywordTransArr(item.keyword)" :key="index">{{key}}</span>
					</dd>
				</dl>
			</div>
			<router-link :to="{name: 'addKeywords', params: {customType: customType}}">
				<div class="add-keywords">
					<div class="add-icon"><i class="iconfont icon-add"></i></div>
				</div>
			</router-link>
		</div>
		<div class="keywords-container" style="background: #fff" v-else>
			<div class="keyword-none">
				<img :src="imgBase + 'icon_dingzhi@3x.png'">{{ $t("opinion.noMadespecial") }}</div>
			<div class="keyword-two">{{ $t("opinion.addSpecial") }}</div>
			<div class="none-line">{{ $t("opinion.findSpecial") }}</div>
			<router-link :to="{name: 'addKeywords', params: {customType: customType}}">
				<div class="add-keywords">
					<div class="add-icon"><i class="iconfont icon-add"></i></div>
				</div>
			</router-link>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex';

	export default {
		data() {
			return {
				tabIndex: NaN,
				editVisible: false,
				editTopText: this.$t('common.edit'),
				keyId: NaN,
				customType: null
			}
		},
		computed: {
			...mapState({
				subjectArr: state => state.sensitive.subjectArr
			})
		},
		activated() {
			const self = this;
			self.editVisible = false;
			self.editTopText = self.$t('common.edit');
			self.customType = self.$route.params.customType;
			self.getKeyWord(self);
		},
		methods: {
			...mapActions(['getKeyWord', 'deleteKeyword']),
			keywordTransArr(keywords) {
				return keywords.split(',');
			},
			showAll(index) {
				const self = this;
				if (self.$('.show-list').eq(index).hasClass('list-all')) {
					self.tabIndex = null;
				} else {
					self.tabIndex = index;
				}
			},
			editShow() {
				const self = this;
				if (self.editTopText === self.$t('common.edit')) {
					self.editVisible = true;
					self.editTopText = self.$t('common.finish');
				} else {
					self.editVisible = false;
					self.editTopText = self.$t('common.edit');
				}
			},
			deleteKey(index, item) {
				const self = this;
				self.keyId = item.id;
				self.$messagebox({
					showCancelButton: true,
					title: self.$t('common.prompt'),
					message: `${self.$t('opinion.sureDelSpecial')}“${item.subjectName}”?`,
					confirmButtonText: self.$t('common.ok'),
					cancelButtonText: self.$t('common.cancel')
				}).then(action => {
					if (action === 'confirm') {
						self.deleteKeyword(self);
						self.subjectArr.splice(index, 1);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.keyword-edit {
		font-size: .7rem;
		color: #152734;
		position: fixed;
		top: 1.6rem;
		right: 1rem;
		z-index: 100;
	}
	.keywords-container {
		height: calc(100% + 55px);
		overflow: auto;
		position: relative;
		-webkit-overflow-scrolling: touch;
		.ks-img{
			text-align: center;
			img{
				width: 3rem;
				height: 3rem;
				margin-bottom: .5rem;
			}
		}
		.keyword-none {
			font-size: .75rem;
			color: #c5cbdf;
			width: 80%;
			text-align: center;
			line-height: 1.25rem;
			margin: 9.3rem auto 0;
			> img {
				width: 3rem;
				display: block;
				margin: 0 auto .5rem;
			}
		}
		.keyword-two {
			font-size: .75rem;
			color: #c5cbdf;
			text-align: center;
			margin-top: .1rem;
		}
		.none-line {
			font-size: .6rem;
			color: #9CAED3;
			margin-top: 4.75rem;
			line-height: 1.25rem;
			padding: 1.35rem 1.1rem 0;
			border-top: 0.05rem solid #E7EDF0;
		}
		.line-height-1 {
			line-height: 1;
		}
		.add-keywords {
			position: fixed;
			width: 3rem;
			height: 3rem;
			border-radius: 50%;
			text-align: center;
			line-height: 3rem;
			background-color: #4e87f9;
			color: #fff;
			right: 1.6rem;
			bottom: .8rem;
			.iconfont {
				font-size: 1.3rem;
			}
		}
		.keywords-box {
			border-bottom: 1px solid #e7edf0;
			dl {
				&.show-list {
					max-height: 5.2rem;
					overflow: hidden;
					transition: all 1s;
					dd {
						display: -webkit-box;
						display: -webkit-flex;
						display: -ms-flexbox;
						display: flex;
						-webkit-flex-wrap: wrap;
						flex-wrap: wrap;
					}
				}
				&.list-all {
					max-height: 86.5rem;
				}
				background: #fff;
                padding: .8rem 1rem;
				dt {
					font-size: .8rem;
					color: #152734;
					span {
						display: inline-block;
						width: 1em;
					}
				}
				&:last-child {
					border-bottom: none;
					padding-bottom: 0;
				}
				dd {
					&.edit-key {
						.inline-block {
							margin-left: .6rem;
							color: #9caed3;
							a {
								color: #9caed3;
							}
							b {
								color: #9caed3;
								font-size: .7rem;
								font-weight: normal;
								margin-right: .2rem;
							}
						}
					}
					color: #9caed3;
					position: relative;
					span {
						font-size: .7rem;
						padding: .2rem .8rem;
						background-color: #f4f7f8;
						border-radius: 1rem;
						margin-right: .5rem;
						text-align: center;
						display: inline-block;
						margin-bottom: .8rem;
					}
					&.open {
						padding-right: 1.4rem;
					}
					i.iconfont {
						font-size: .7rem;
						color: #4f84ef;
						position: absolute;
						top: 50%;
						transition: all .3s;
						transform: rotate(0deg) translateY(-50%);
						right: 0;
						&.list-icon {
							transform: rotate(-180deg) translateY(50%);
						}
					}
				}
			}
		}
	}
</style>
