<template>
	<div class="index-container">
		<div class="addkey-container">
			<div class="addkey-form">
				<label for="subject">{{ $t("opinion.specialName") }}</label>
				<input type="text" maxlength="4" minlength="2" name="subject" id="subject" :placeholder="`${$t('opinion.specialNameTips')}`" v-model="specialName" @focus="hideError">
				<div class="addkyeword-box">
					<label>{{ $t("opinion.keywords") }}</label>
					<div class="add-keywords">
						<div v-for="(item, index) in keyInput" :key="index">
							<input type="text" :name="'keyword' + index" :id="'keyword' + index" :placeholder="`${$t('opinion.keywordPlaceholder')}` + (index + 1)" maxlength="10" v-model="keyInput[index]" v-on:focus="hideError">
							<i class="iconfont icon-delete" @click="deleteInput(index)"></i>
						</div>
					</div>
				</div>
			</div>
			<div class="add-key-input">
				<a @click="addKeyInput()"><i class="iconfont icon-add"></i>{{ $t("opinion.addkeywords") }}</a>
				<p class="submit-error">
					<span v-show="errorShow">{{ submitError }}</span>
				</p>
			</div>
			<div class="import-tips">
				<p>{{ $t("opinion.moreRemarks") }}<span style="color: #f00">&</span>{{ $t("opinion.connectKey") }}</p>
				<p>{{ $t("opinion.newAddKeyword") }}</p>
			</div>
			<div class="add-key-input submit-key-box">
				<a class="subimt-key" @click="submitKey()">{{ $t("common.ok") }}</a>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions } from 'vuex';

	export default {
		data() {
			return {
				keyInfo: '科技&海航生态',
				specialName: '',
				keywords: '',
				keyInput: ['', ''],
				keywordId: NaN,
				errorShow: false,  // 警告是否显示
				submitError: '' // 警告信息文本
			}
		},
		activated() {
			const self = this;
			self.specialName = '';
			self.keyInput = ['', ''];
			self.keywordId = self.$route.params.id;
			if (self.keywordId) {
				self.getKeyword(self);
			}
			self.firstPlaceholder();
		},
		methods: {
			...mapActions(['addKeyword', 'getKeyword', 'editKeywords']),
			hideError() {
				const self = this;
				self.errorShow = false;
			},
			deleteInput(index) {
				const self = this;
				if (self.keyInput.length !== 1) {
					self.keyInput.splice(index, 1);
				} else {
					self.errorShow = true;
					self.submitError = self.$t('opinion.onlyoneKeyword');
				}
			},
			addKeyInput() {
				const self = this;
				self.keyInput.push('');
			},
			firstPlaceholder() {
				const self = this;
				self.$('.add-keywords > div > input').eq(0).attr('placeholder', self.keyInfo);
			},
			submitKey() {
				const self = this;
				if (!self.specialName) {
					self.errorShow = true;
					self.submitError = self.$t('opinion.specialNmaeNone');
					return;
				}
				if (self.specialName.length < 2) {
					self.errorShow = true;
					self.submitError = self.$t('opinion.specialNmaeLen');
					return;
				}
				if (self.textInvalid(self.specialName)) {
					// self.$messagebox({
					// 	title: self.$t('common.prompt'),
					// 	message: self.$t('opinion.specialNmaeIllegal'),
					// 	confirmButtonText: self.$t('common.ok')
					// });
					self.Notice('fail', 'opinion.specialNmaeIllegal');
					return;
				}
				for (const item of self.keyInput) {
					if (item.length === 0) {
						self.errorShow = true;
						self.submitError = self.$t('opinion.keywordNone');
						return;
					}
					if (item.length < 2) {
						self.errorShow = true;
						self.submitError = self.$t('opinion.keywordLength');
						return;
					}
				}
				if (self.keyInput.some(item => self.textInvalid(item))) {
					// self.$messagebox({
					// 	title: self.$t('common.prompt'),
					// 	message: self.$t('opinion.keywordIllegal'),
					// 	confirmButtonText: self.$t('common.ok')
					// });
					self.Notice('fail', 'opinion.keywordIllegal');
					return;
				}
				if (self.keywordId) {
					self.editKeywords(self);
				} else {
					self.addKeyword(self);
				}
			}
		}
	}
</script>

<style lang="scss">
	.addkey-container {
		padding: 0 1rem;
		background-color: #fff;
		height: calc(100% + 55px);
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		.add-tips {
			font-size: .6rem;
			color: #666;
			padding-top: .5rem;
			span {
				color: #f00;
				margin-right: .25rem;
			}
		}
		.addkey-form {
			margin-top: 1.5rem;
			.addkyeword-box {
				margin-top: 1rem;
			}
			.add-keywords {
				display: -webkit-box;
				display: -webkit-flex;
				display: -ms-flexbox;
				display: flex;
				-webkit-flex-wrap: -webkit-wrap;
				flex-wrap: wrap;
				-webkit-justify-content: -webkit-space-between;
	        	justify-content: space-between;
	        	> div {
	        		margin-top: .5rem;
	        		.icon-delete {
	        			color: #4f84ef;
	        			font-size: .7rem;
	        			margin: 0 .1rem;
	        		}
	        	}
			}
			label {
				font-size: .8rem;
				color: #152734;
			}
			input[type="text"] {
				width: 7.2rem;
				height: 1.6rem;
				line-height: 1.6rem;
				border-radius: 1rem;
				background-color: #f4f7f8;
				border: none;
				padding-left: .7rem;
				font-size: .7rem;
				color: #333;
				&:focus {
					outline: none;
				}
				&::-webkit-input-placeholder  {
					color: #ccc;
				}
			}
		}
		.import-tips {
			margin-top: .5rem;
			p {
				font-size: .6rem;
				color: #a0b2d5;
			}
			.indent {
				padding-left: 3em;
			}
		}
		.addkey-btn {
			padding: 0 2rem;
			margin-top: 2rem;
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
		    -webkit-justify-content: -webkit-space-between;
	        justify-content: space-between;
	        .icon-btn {
	        	width: 2.5rem;
	        	height: 2.5rem;
	        	background-color: #fff;
	        	border: 1px solid #0381e6;
	        	border-radius: 50%;
	        	line-height: 2.5rem;
	        	text-align: center;
	        	color: #0381e6;
	        	i {
	        		font-size: 1.4rem;
	        	} 
	        	&.icon-sure {
	        		background-color: #0381e6;
	        		color: #fff;
	        	}
	        }
		} 
		.add-key-input {
			text-align: center;
			margin-top: 2rem;
			padding-bottom: 1rem;
			border-bottom: 1px solid #e7edf0;
			&.submit-key-box {
				border-bottom: none;
				padding-bottom: 1rem;
			}
			p {
				color: #f00;
				margin-top: 2rem;
			}
			a {
				display: inline-block;
				width: 7rem;
				height: 1.6rem;
				line-height: 1.6rem;
				font-size: .7rem;
				color: #fff;
				background-color: #4f84ef;
				border-radius: 1rem;
				-webkit-box-shadow: 0 2px 4px 0 rgba(79, 132, 239, 0.5);
				box-shadow: 0 2px 4px 0 rgba(79, 132, 239, 0.5);
				i {
					font-size: .8rem;
					margin-right: .2rem;
				}
				&.subimt-key {
					width: 12rem;
					-webkit-box-shadow: 0 2px 4px 0 rgba(79, 132, 239, 0.4);
					box-shadow: 0 2px 4px 0 rgba(79, 132, 239, 0.4);
				}
			}
		}
	}
</style>
