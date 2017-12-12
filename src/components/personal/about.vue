<template>
	<div class="index-container">
		<div class="about-container">
			<div class="about-logo"><img :src="imgBase + 'about-logo.png'"></div>
			<div class="about-title">{{ $t("profile.opinionCloud") }}</div>
			<p class="about-detail">
				{{ $t("profile.aboutDetail") }}
			</p>
			<p class="copy-right" v-html="$t('profile.copyright')"></p>
		</div>
	</div>
</template>

<script>
	export default {}
</script>

<style lang="scss">
	.about-container {
		height: calc(100% + 55px);
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		position: relative;
		.about-logo {
			width: 3.2rem;
			margin: 80px auto 0;
		}
		.about-title {
			font-size: .8rem;
			color: #152734;
			text-align: center;
			margin-top: .6rem;
		}
		.about-detail {
			text-indent: 2em;
			margin-top: 2.6rem;
			padding: 0 1.25rem;
			line-height: 1.3rem;
			font-size: .7rem;
			color: #9ba1a6;
		}
		.copy-right {
			font-size: .6rem;
			color: #9ba1a6;
			position: absolute;
			bottom: 1rem;
			-webkit-transform: scale(0.9);
			transform: scale(0.9);
			width: 100%;
			text-align: center;
		}
	}
</style>
