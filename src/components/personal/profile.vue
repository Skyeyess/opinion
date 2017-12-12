<template>
	<div class="index-container">
		<div class="profile-container">
			<div class="profile-main">
				<div class="head-box clearfix">
					<div class="head-img" @click="uploadPhoto">
						<img :src="profile.empPhoto || (imgBase + 'icon-personal.png')">
						<!-- <em>{{ profile.headerImg }}</em> -->
					</div>
					<router-link :to="{name: 'setting'}">
						<div class="head-info">
							<p>{{ profile.empName }}
								<i class="mintui mintui-back"></i>
							</p>
						</div>
					</router-link>
				</div>
			</div>
			<ul class="profile-info-list">
				<li v-if="appShow || emailShow">
					<router-link :to="{name: 'message'}">
						<span class="label-value">{{ $t("profile.notice") }}</span>
						<i class="is-read" v-if="count !== 0" v-text="formatCount(count)"></i>
					</router-link>
				</li>
				<li>
					<router-link :to="{name: 'myComment'}">
						<span class="label-value">我的评论</span>
					</router-link>
				</li>
				<li>
					<router-link :to="{name: 'collection'}">
						<span class="label-value">{{ $t("profile.collection") }}</span>
					</router-link>
				</li>
				<!-- <li>
						<router-link :to="{name: 'language'}">
							<span class="label-value">{{ $t("common.language") }}</span>
						</router-link>
					</li> -->
			</ul>
			<div class="no-link have-link">
				<router-link :to="{name: 'about'}">
					<div class="no-link-box no-link-line">
						<span class="label-value">{{ $t("common.about") }}</span>
					</div>
				</router-link>
			</div>
			<div class="no-link">
				<div class="no-link-box">
					<span class="label-value">{{ $t("profile.version") }}</span>
					<span class="label-value">v{{version}}{{lastVersion}}</span>
				</div>
			</div>
			<div v-if="appShow || emailShow" class="no-link have-link">
				<router-link :to="{name: 'switches'}">
					<div class="no-link-box">
						<span class="label-value">{{ $t("common.pushSetting") }}</span>
					</div>
				</router-link>
			</div>
			<div class="logout" @click="logout">{{ $t("profile.logout") }}</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
	data() {
		return {
			appShow: false,
			emailShow: false,
			version: localStorage.appVersion || ''
		}
	},
	computed: {
		...mapState({
			profile: state => state.profile.data,
			lastVersion: state => state.profile.lastVersion,
			count: state => state.message.count,
			userId: state => state.login.userId
		})
	},
	mounted() {
		const self = this;
		self.getVersion(self);
	},
	activated() {
		const self = this;
		self.sendClient({ body: localStorage.userName });
		self.getSwitchStatus(self);
		self.getProfile(self);
		self.getNoReads(self);
		window.addEventListener('storageEvent', function(e) {
			if (e.storageKey === 'userPhoto') {
				localStorage.removeItem('userPhoto');
				self.getProfile(self);
			}
		});
	},
	methods: {
		...mapActions(['getNoReads', 'getProfile', 'getSwitchStatus', 'getVersion', 'sendLog']),
		formatCount(count) {
			if (count && count > 99) {
				return '99+';
			} else {
				return count;
			}
		},
		uploadPhoto() {
			const self = this;
			self.Logger('用户头像');
			self.sendClient({ body: true, type: 'photo' });
		},
		logout() {
			const self = this;
			self.$messagebox({
				showCancelButton: true,
				title: self.$t('common.prompt'),
				message: self.$t('login.logout'),
				confirmButtonText: self.$t('common.ok'),
				cancelButtonText: self.$t('common.cancel')
			}).then(action => {
				if (action === 'confirm') {
					self.Logger('退出登录');
					if (localStorage.userName && localStorage.log) {
						self.sendLog(true);
					}
				}
			});
		}
	}
}
</script>

<style lang="scss">
@import '../../assets/common.scss';
.profile-container {
	background: #f4f7f9;
	height: calc(100vh - 3.2rem);
	overflow: auto;
	position: relative;
	-webkit-overflow-scrolling: touch;
	.profile-main {
		.head-box {
			height: 7.9rem;
			padding: 1.5rem 1rem 0;
			background: url('#{$imgBase}profile-bg.png') 0 0 no-repeat #fff;
			background-size: cover;
			text-align: center;
			.head-info {
				margin-top: .8rem;
				min-height: 1.8rem;
				p {
					font-size: .8rem;
					color: #273844;
					position: relative;
					line-height: 1;
					i.mintui-back {
						position: absolute;
						top: 0;
						left: 58.5%;
						font-size: .8rem;
						color: #D8D8D8;
						display: inline-block; // -webkit-transform: rotate(180deg);
						transform: rotate(180deg);
					}
				}
			}
		}
		.mint-cell-wrapper {
			font-size: 0.8rem;
		}
		.head-img {
			width: 3.4rem;
			height: 3.4rem; // background: #afafaf;
			border-radius: 50%;
			display: inline-block;
			text-align: center;
			line-height: 3.4rem;
			font-size: .6rem;
			color: #fff;
			img {
				width: 3.4rem;
				height: 3.4rem;
				border-radius: 50%;
				border: 2px solid #F4F7F8;
				box-sizing: content-box;
			}
		}
	}
	.profile-info-list {
		background-color: #fff;
		margin-top: .4rem;
		li {
			a {
				display: -webkit-box;
				display: -webkit-flex;
				display: -ms-flexbox;
				display: flex;
				-webkit-align-items: center;
				align-items: center;
				width: 100%;
				height: 100%;
			}
			height: 2.5rem;
			margin-left: 0.6rem;
			margin-right: 0.6rem;
			padding-left: 1rem;
			padding-right: 1rem;
			border-bottom: 1px solid #e7edf0;
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-align-items: center;
			align-items: center;
			position: relative;
			&:last-child {
				border: none;
			}
			&:after {
				content: "\E600";
				display: block;
				font-family: "mintui" !important;
				font-size: .8rem;
				font-style: normal;
				-webkit-font-smoothing: antialiased;
				-webkit-text-stroke-width: 0.2px;
				-moz-osx-font-smoothing: grayscale;
				-webkit-transform: translateY(-50%) rotate(180deg);
				transform: translateY(-50%) rotate(180deg);
				position: absolute;
				right: 0;
				top: 50%;
				color: #a1b4da;
			}
			.iconfont {
				color: #4e87f9;
				margin-right: 1.5rem;
				font-size: .8rem;
			}
			.label {
				display: inline-block;
				width: 4em;
				margin-right: 1.1rem;
				font-size: .7rem;
				color: #a1b4da;
			}
			.label-value {
				color: #152734;
				font-size: .75rem;
			}
			.is-read {
				display: inline-block;
				width: 1.9rem;
				text-align: center;
				height: 1rem;
				line-height: 1rem;
				border-radius: .45rem;
				font-style: normal;
				background: #E75E5E;
				font-size: .6rem;
				color: #fff;
				position: absolute;
				right: 2.5rem;
				top: 50%;
				-webkit-transform: translateY(-50%);
				transform: translateY(-50%);
			}
		}
	}
	.no-link {
		background: #fff;
		position: relative;
		.no-link-box {
			height: 2.5rem;
			margin-left: 0.6rem;
			padding-left: 1rem;
			padding-right: 1rem;
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-align-items: center;
			align-items: center;
			-webkit-justify-content: space-between;
			justify-content: space-between;
			&.no-link-line {
				border-bottom: 1px solid #e7edf0;
			}
			.label-value {
				color: #152734;
				font-size: .75rem;
			}
		}
		&.have-link {
			margin-top: .4rem;
			.no-link-box {
				margin-right: 0.6rem;
				position: relative;
				&:after {
					content: "\E600";
					display: block;
					font-family: "mintui" !important;
					font-size: .8rem;
					font-style: normal;
					-webkit-font-smoothing: antialiased;
					-webkit-text-stroke-width: 0.2px;
					-moz-osx-font-smoothing: grayscale;
					-webkit-transform: translateY(-50%) rotate(180deg);
					transform: translateY(-50%) rotate(180deg);
					position: absolute;
					right: 0;
					top: 50%;
					color: #a1b4da;
				}
			}
		}
	}
	.logout {
		height: 2rem;
		background: #E75E5E;
		color: #fff;
		width: 73.1%;
		margin: 2rem auto 1rem;
		line-height: 2rem;
		text-align: center;
		border-radius: .2rem;
		font-size: .8rem;
		border-top: 1px solid #e7edf0;
		border-bottom: 1px solid #e7edf0;
	}
}
</style>
