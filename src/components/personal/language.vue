<template>
	<div class="index-container">
		<div class="language-container">
			<mt-radio
				align="right"
				v-model="languageValue"
				:options="options">
			</mt-radio>
		</div>
		<a class="save-language" @click="saveLanguage" v-text="$t('common.save')"></a>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				languageValue: 'cn',
				options: [
					{
						label: '中文',
						value: 'cn'
					},
					{
						label: 'English',
						value: 'en'
					}
				]
			}
		},
		activated() {
			const self = this;
			self.languageValue = localStorage.language || 'cn';
		},
		methods: {
			saveLanguage() {
				const self = this;
				self.$i18n.locale = self.languageValue;
				localStorage.language = self.languageValue;
				self.$parent.changeI18n = false;
				setTimeout(() => {
					self.$parent.changeI18n = true;
					self.$router.push({name: 'hna'});
				}, 0);
			}
		}
	}
</script>

<style lang="scss">
	.language-container {
		.mint-cell-wrapper {
			background-image: none;
			border-bottom: 1px solid #e7edf0;
		}
		.mint-cell:last-child {
			background-image: none;
		}
	}
	.save-language {
		position: fixed;
		top: 1.45rem;
		right: 10px;
		z-index: 8;
		padding: .15rem .8rem;
		background: #4f84ef;
		color: #fff;
		font-size: .7rem;
		border-radius: 5px;
	}
</style>
