<template>
	<div class="index-container">
		<div class="setting-container">
			<div class="profile-main">
				<ul class="profile-info">
					<li>
						<i class="iconfont icon-user-o"></i>
						<span class="label">{{ $t("profile.fullName") }}</span>
						<span class="label-val">{{ profile.empName }}</span>
					</li>
					<li>
						<i class="iconfont icon-dept"></i>
						<span class="label">{{ $t("profile.department") }}</span>
						<span class="label-val">{{ profile.empPosition }}</span>
					</li>
					<li>
						<i class="iconfont icon-group"></i>
						<span class="label">{{ $t("profile.locationGroup") }}</span>
						<span class="label-val">{{ profile.empCompany }}</span>
					</li>
					<li>
						<i class="iconfont icon-email"></i>
						<span class="label">E-mail	</span>
						<span class="label-val">{{ profile.empEmail }}</span>
					</li>
					<li>
						<i class="iconfont icon-tel"></i>
						<span class="label">Tel</span>
						<span class="label-val">{{ profile.empMobile }}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex';

	export default {
		data() {
			return {
				message: ''
			}
		},
		computed: {
			...mapState({
				profile: state => state.profile.data,
				userId: state => state.login.userId
			})
		},
		activated() {
			const self = this;
			self.getProfile(self);
		},
		methods: {
			...mapActions(['getProfile'])
		}
	}
</script>

<style lang="scss">
	.setting-container {
		.profile-main {
			.profile-info {
				background-color: #fff;
				margin-top: .4rem;
				li {
					height: 2.5rem;
					margin-left: 2rem;
					margin-right: 1rem;
					border-bottom: 1px solid #e7edf0;
					display: -webkit-box;
					display: -webkit-flex;
					display: -ms-flexbox;
					display: flex;
					-webkit-align-items: center;
					align-items: center;
					&:last-child {
						border-bottom: none;
					}
					.iconfont {
						color: #4e87f9;
						margin-right: 1.5rem;
						font-size: .8rem;
					}
					.label {
						display: inline-block;
						width: 3.1rem;
						margin-right: 1rem;
						font-size: .75rem;
						color: #a1b4da;
					}
					.label-val {
						color: #152734;
						font-size: .7rem;
					}
				}
			}
		}
	}
</style>
