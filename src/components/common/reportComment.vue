<template id="reportComment">
 <div class="common-modal" @click.self="$parent.commentReport = true">
	<div class="report-box">
		<div class="report-title">投诉
			<i class="iconfont icon-error" @click="$parent.commentReport = true"></i>
		</div>
		<div class="report-content">
			<div class="report-type">
				<h4>请选择类型：</h4>
				<div class="report-radio">
					<div v-for="(type, index) of reportTypes" :key="index" @click="selectType(type, $event)">
						<label class="report-label">
							<input type="radio" name="report" :value="type.key" v-model="reportType">
							<img v-if="reportType === type.key" :src="imgBase + 'selected.png'">
							<img v-else :src="imgBase + 'select.png'">
							<em v-text="type.val"></em>
						</label>
					</div>
				</div>
			</div>
			<div class="report-textarea">
				<textarea class="report-input" maxlength="24" @focus="onFocus" @blur="noFocus" :readonly="reportType !== '-1'" v-model="reportContent" placeholder="请输入您的投诉类型，我们会尽快处理……"></textarea>
				<span class="word-rest">{{ reportContent.length > 24 ? 0 : (24 - reportContent.length) }}字</span>
			</div>
			<div class="report-ok">
				<button type="button" @click="reportTo">确定</button>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {
			reportType: '1',
			reportVal: '',
			reportContent: '',
			reportSend: true,
			moveLeg: 0
		}
	},
	computed: {
        ...mapState({
            reportTypes: state => state.comment.reportTypes
        })
	},
	mounted() {
		const self = this;
		self.getReportType(self);
		window.addEventListener('storageEvent', function (e) {
            if (e.storageKey === 'keyboard') {
                if (e.storageValue === 'close') {
                    localStorage.removeItem('keyboard');
                    document.querySelector('.report-box').style = '';
                }
            }
		});
	},
	watch: {
		reportType(newValue) {
			const self = this;
			if (newValue && newValue === '-1') {
				self.$nextTick(() => {
					if (!/(Android)/i.test(navigator.userAgent)) {
						document.querySelector('.report-input').focus();
					} else {
						document.querySelector('.report-input').focus();
						document.querySelector('.report-box').style.paddingBottom = `${document.body.clientHeight - self.moveLeg - 30}px`;
					}
				});
			} else {
				document.querySelector('.report-box').style = '';
				document.querySelector('.report-input').blur();
			}
		}
	},
	methods: {
		...mapActions(['getReportType', 'reportComment']),
		onFocus() {
			const self = this;
			if (self.reportType !== '-1') {
				document.querySelector('.report-input').blur();
			} else {
				self.interval = setInterval(() => {
					self.scrollToEnd();
				}, 500)
			}
        },
        noFocus() {
			const self = this;
            setTimeout(() => {
                clearInterval(self.interval);
            })
        },
        scrollToEnd() {
            document.body.scrollTop = document.body.scrollHeight;
        },
		selectType(type, event) {
			const self = this;
			self.moveLeg = event.y;
			if (type.key === '-1') {
				self.reportVal = '';
			} else {
				self.reportVal = type.val;
			}
		},
		reportTo() {
			const self = this;
			if (self.reportType === '-1') {
				if (!self.reportContent || self.reportContent.length > 24) {
					return;
				}
			}
			if (!self.reportSend) {
                self.Notice('success', 'comment.processing');
                return;
            }
            self.reportSend = false;
			self.reportComment(self);
		}
	}
}
</script>

<style scoped lang="scss">
.report-box {
	width: 100%;
	background-color: #fff; // padding-bottom: 2.85rem;
	// height: 50%;
	position: absolute;
	bottom: 0;
	z-index: 101;
	.report-title {
		font-size: 0.8rem;
		color: #152734;
		line-height: 2rem;
		text-align: center;
		position: relative;
		border-bottom: 1px solid #ddd;
		>.iconfont {
			position: absolute;
			right: 1rem;
			font-size: 1.2rem;
		}
	}
	.report-content {
		padding: 0.8rem 1.2rem;
		width: 100%;
		height: 14.5rem;
		// height: -webkit-calc(100% - 2.3rem);
		// height: calc(100% - 2.3rem);
		// overflow: scroll;
		// -webkit-overflow-scrolling: touch;
		>h4 {
			font-size: 0.8rem;
			color: #152734;
			font-weight: normal;
			padding-top: 0.8rem;
		}
		.report-main {
			background: #F4F7F8;
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			padding: 0.5rem;
			margin: 0.8rem 0;
			.report-head {
				width: 2rem;
				>img {
					border-radius: 50%;
				}
			}
			.reprot-text {
				font-size: 0.75rem;
				color: #051C2D;
				margin-left: 0.5rem;
			}
		}
		.report-type {
			>h4 {
				font-size: 0.8rem;
				color: #152734;
				font-weight: normal;
				margin-bottom: .8rem;
			}
			.report-radio {
				display: -webkit-box;
				display: -webkit-flex;
				display: -ms-flexbox;
				display: flex;
				-webkit-flex-wrap: -webkit-wrap;
				flex-wrap: wrap;
				-webkit-justify-content: space-between;
				justify-content: space-between;
				min-height: 4.5rem;
				margin-bottom: 0.3rem;
				>div {
					width: 33.33%;
					margin-bottom: 0.5rem;
					&:nth-child(3n) {
						text-align: right;
					}
					&:nth-child(3n + 1) {
						text-align: left;
					}
					&:nth-child(3n + 2) {
						text-align: center;
					}
				}
				.report-label {
					input[type="radio"] {
						display: none;
					}
					>img {
						width: 0.7rem;
					}
					>em {
						color: #152734;
						margin-left: 0.2rem;
						font-size: 0.75rem;
						line-height: 1rem;
						vertical-align: middle;
					}
				}
			}
		}
		.report-textarea {
			position: relative;
			>textarea {
				width: 100%;
				height: 3.2rem;
				background-color: #F4F7F8;
				border: none;
				padding: 0.5rem 0.6rem;
				font-size: 0.7rem;
				color: #152734;
				resize: none;
				&::-webkit-input-placeholder {
					color: #A1B4DA;
				}
			}
			.word-rest {
				position: absolute;
				right: 0.7rem;
				bottom: 0.4rem;
				font-size: 0.7rem;
				color: #A1B4DA;
			}
		}
		.report-ok {
			text-align: center;
			margin-top: 0.8rem;
			>button {
				display: inline-block;
				width: 64%;
				height: 1.6rem;
				line-height: 1.6rem;
				font-size: 0.75rem;
				color: #fff;
				background-color: #4F84EF;
				border-radius: 1rem;
				-webkit-box-shadow: 0 2px 4px 0 rgba(79, 132, 239, 0.40);
				box-shadow: 0 2px 4px 0 rgba(79, 132, 239, 0.40);
				border: none;
			}
		}
	}
}
</style>
