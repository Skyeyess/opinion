<template>
	<div class="index-container">
		<div class="switch-container">
			<div v-if="appShow">
				<h3>{{ $t("profile.opinionReport") }}</h3>
				<mt-cell :title="$t('profile.appPush')">
					<mt-switch v-model="appValue" @change="postMessageApp(),Logger('report-app')"></mt-switch>
				</mt-cell>
				<div class="cut-line"></div>
				<mt-cell :title="$t('profile.appEmail')">
					<mt-switch v-model="opinionValue" @change="postMessageOpinion(),Logger('report-email')"></mt-switch>
				</mt-cell>
			</div>
			<div v-if="emailShow">
				<h3>{{ $t("profile.sensitiveOpinion") }}</h3>
				<mt-cell :title="$t('profile.appPush')">
					<mt-switch v-model="emailValue" @change="postMessageEmail(),Logger('sensitive-app')"></mt-switch>
				</mt-cell>
				<div class="cut-line"></div>
				<mt-cell :title="$t('profile.appEmail')">
					<mt-switch v-model="dataValue" @change="postMessageData(),Logger('sensitive-email')"></mt-switch>
				</mt-cell>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions } from 'vuex';

	export default {
		data() {
			return {
				appValue: true,
				emailValue: true,
				opinionValue: true,
				dataValue: true,
				appShow: false,
				emailShow: false
			}
		},
		activated() {
			const self = this;
			self.getSwitchStatus(self);
		},
		methods: {
			...mapActions(['switchMessageApp', 'switchMessageEmail', 'switchMessageOpinion', 'switchMessageData', 'getSwitchStatus']),
			postSwitch(data) {
				if (data) return 0;
					else return 1;
			},
			postMessageApp() {
				const self = this;
				self.switchMessageApp(self);
			},
			postMessageEmail() {
				const self = this;
				self.switchMessageEmail(self);
			},
			postMessageOpinion() {
				const self = this;
				self.switchMessageOpinion(self);
			},
			postMessageData() {
				const self = this;
				self.switchMessageData(self);
			}
		}
	}
</script>

<style lang="scss">
	.switch-container {
		h3 {
			font-size: .6rem;
			color: #A1B4DA;
			font-weight: normal;
			padding: .5rem 0 .5rem 1.5rem;
		}
		.cut-line {
			background: #fff;
			padding-left: 1.5rem;
			&:before {
				content: "";
				display: block;
				border-bottom: 1px solid #eee;
			}
		}
		.mint-cell {
			.mint-cell-wrapper {
				padding-left: 1.5rem;
				background-image: none;
				.mint-cell-value {
					.mint-switch-core {
						width: 2.35rem;
						height: 1.2rem;
						&:before {
							width: 2.25rem;
							height: 1.1rem;
						}
						&:after {
							width: 1.1rem;
							height: 1.1rem;
						}
					}
					.mint-switch-input:checked + .mint-switch-core {
						background-color: #4F87F8;
						border-color: #4F87F8;
						color: #4F87F8;
					}
					.mint-switch-input:checked + .mint-switch-core::after {
						-webkit-transform: translateX(1.2rem);
						-moz-transform: translateX(1rem);
						transform: translateX(1.15rem);
					}
				}
				.mint-cell-title{
					.mint-cell-text {
						font-size: .75rem;
					}
				}
			}
		}
	}
</style>
