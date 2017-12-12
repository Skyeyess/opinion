<template>
<div class="summary-container">
    <div id="summary-news" class="summary-news" ref="summaryMain" v-rocket="{ num: scrollNum, menu: 1 }" @scroll="opinionScroll">
        <load-more 
		:news-data="newsData" 
		:ref-name="'summaryMore'"
		@getList="getList">
            <div slot="header">
                <div class="summary-type clearfix">
                    <label class="left" :class="{'active': source === ''}">
                        <input type="radio" name="source" value="" v-model="source" v-show="false">
                        <!-- <img v-if="source === ''" :src="imgBase + 'selected.png'">
                        <img v-else :src="imgBase + 'select.png'"> -->
                        <em v-text="$t('opinion.all')"></em>
                    </label>
                    <label class="left" :class="{'active': source === 'opinions'}">
                        <input type="radio" name="source" value="opinions" v-model="source" v-show="false">
                        <!-- <img v-if="source === 'opinions'" :src="imgBase + 'selected.png'">
                        <img v-else :src="imgBase + 'select.png'"> -->
                        <em v-text="$t('opinion.domestic')"></em>
                    </label>
                    <label class="left" :class="{'active': source === 'overseas'}">
                        <input type="radio" name="source" value="overseas" v-model="source" v-show="false">
                        <!-- <img v-if="source === 'overseas'" :src="imgBase + 'selected.png'">
                        <img v-else :src="imgBase + 'select.png'"> -->
                        <em v-text="$t('opinion.overseas')"></em>
                    </label>
                    <div class="tooltip-right" v-if="showTooltip">
                        <span class="tooltip-text">点击这里筛选舆情</span>
                        <img :src="imgBase + 'pop_close.png'" class="tooltip-close" @click.self="hideTip">
                    </div>
                    <div class="common-filter" @click="pickerShow = !pickerShow, hideTip()">
                        <i class="iconfont" :class="pickerShow ? 'icon-arrow-up': 'icon-filter'"></i>
                    </div>
                </div>
                <div class="date-picker" :class="{'show': pickerShow, 'hna-show': $parent.roleValue === rootRole}">
                    <div class="date-picker-content clearfix">
                        <div class="date-picker-start left">
                            <em v-text="$t('opinion.from')"></em>
                            <span v-text="dateFormat(pickerStart, 'date')" :class="{'placeholder': pickerStart === $t('opinion.selectTime')}" @click="pickerOpen('pickerStart')"></span>
                        </div>
                        <div class="date-picker-end left">
                            <em v-text="$t('opinion.to')"></em>
                            <span v-text="dateFormat(pickerEnd, 'date')" :class="{'placeholder': pickerEnd === $t('opinion.selectTime')}" @click="pickerOpen('pickerEnd')"></span>
                        </div>
                        <div class="clearfix"></div>
                        <div class="picker-company" v-if="$parent.roleValue !== rootRole">
                            <em v-text="$t('opinion.membership')"></em>
                            <span v-text="pickerItemValue" :class="{'placeholder': pickerItemValue === $t('opinion.select')}" @click="pickerItem = true" ></span>
                        </div>
                    </div>
                    <div class="date-picker-find left" :class="{'disabled' : resetState}" @click="clearDate" v-text="$t('opinion.reset')"></div>
                    <div class="date-picker-find right" :class="{'disabled' : inquireState}" @click="dateFilter" v-text="$t('opinion.inquire')"></div>
                </div>
            </div>
		</load-more>
    </div>
    <mt-datetime-picker ref="pickerStart" type="date" v-model="initStartDate" :confirmText="$t('common.ok')" :cancelText="$t('common.cancel')" :startDate="minStartDate" :endDate="maxStartDate" @confirm="pickerStartSelect">
    </mt-datetime-picker>
    <mt-datetime-picker ref="pickerEnd" type="date" v-model="initEndDate" :confirmText="$t('common.ok')" :cancelText="$t('common.cancel')" :startDate="minEndDate" :endDate="maxEndDate" @confirm="pickerEndSelect">
    </mt-datetime-picker>
    <mt-popup v-model="pickerItem" position="bottom" class="mint-datetime">
        <mt-picker
        class="mint-datetime-picker"
        :slots="companyList"
        @change="pickerChange"
        show-toolbar>
        <span class="mint-datetime-action mint-datetime-cancel" @click="pickerItem = false" v-text="$t('common.cancel')"></span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="pickerItemValue = currentSelect,pickerItem = false" v-text="$t('common.ok')"></span>
        </mt-picker>
    </mt-popup>
</div>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            state: 'first',
            pickerShow: false,
            initStartDate: new Date(),
            initEndDate: new Date(),
            minStartDate: new Date(new Date().getTime() - 31536000000),
            minEndDate: new Date(new Date().getTime() - 31536000000),
            maxStartDate: new Date(),
            maxEndDate: new Date(),
            pickerStart: this.$t('opinion.selectTime'),
            pickerEnd: this.$t('opinion.selectTime'),
            customDate: false,
            pickerItem: false,
            pickerItemValue: this.$t('opinion.select'),
            showTooltip: !localStorage.summaryTip,
            currentSelect: '',
            source: '',
            day: 0,
            scrollNum: 0
        }
    },
    computed: {
        resetState() {
            const self = this;
            return !/^[0-9]*$/.test(self.pickerStart) && !/^[0-9]*$/.test(self.pickerEnd) && self.pickerItemValue === self.$t('opinion.select');
        },
        inquireState() {
            const self = this;
            return (!/^[0-9]*$/.test(self.pickerStart) && /^[0-9]*$/.test(self.pickerEnd)) || (/^[0-9]*$/.test(self.pickerStart) && !/^[0-9]*$/.test(self.pickerEnd)) || self.resetState;
        },
        ...mapState({
            newsData: state => state.opinion.summaryNews,
            companyList: state => state.opinion.companyList
        })
    },
    mounted() {
        const self = this;
        self.getSummaryCompany(self)
        if (sessionStorage.summaryType) {
            self.source = sessionStorage.summaryType;
        }
        if (sessionStorage.summaryTime) {
            if (sessionStorage.summaryCompany) {
                self.pickerItemValue = sessionStorage.summaryCompany;
            }
            self.pickerStart = Number(sessionStorage.summaryTime.split(',')[0]);
            self.pickerEnd = Number(sessionStorage.summaryTime.split(',')[1]);
            self.dateFilter();
        } else if (sessionStorage.summaryCompany) {
            self.pickerItemValue = sessionStorage.summaryCompany;
            self.dateFilter();
        } else {
            self.day = 0;
            self.getSummaryNews(self);
        }
        self.clearDate()
    },
    activated() {
        const self = this;
        self.$refs.summaryMain.scrollTop = self.scrollNum;
        self.clearRefresh(self, 'summaryMore');
    },
    watch: {
        source(newValue, oldValue) {
            const self = this;
            if (newValue !== oldValue) {
                sessionStorage.summaryType = self.source;
                self.state = 'first';
                self.getSummaryNews(self);
            }
            if (newValue === '') {
                self.Logger('all')
            }
            if (newValue) {
                self.Logger(self.source)
            }
        },
        pickerShow(oldValue, newValue) {
            const self = this;
            setTimeout(() => {
                self.getEleHeight();
            }, 500);
        }
    },
    methods: {
        ...mapActions(['getSummaryNews', 'getSummaryCompany']),
        hideTip() {
            const self = this;
            self.showTooltip = false;
            localStorage.summaryTip = true;
        },
        clearDate() {
            const self = this;
            if (self.resetState) return;
            self.customDate = false;
            self.pickerStart = self.$t('opinion.selectTime');
            self.pickerEnd = self.$t('opinion.selectTime');
            self.pickerItemValue = self.$t('opinion.select');
            self.minStartDate = new Date(new Date().getTime() - 31536000000);
            self.minEndDate = new Date(new Date().getTime() - 31536000000);
            sessionStorage.removeItem('summaryTime');
            sessionStorage.removeItem('summaryCompany');
            self.state = 'first';
            self.Logger('速览重置');
            self.getSummaryNews(self);
        },
        pickerChange(item) {
            const self = this;
            self.currentSelect = item.values[0];
        },
        pickerStartSelect(time) {
            const self = this;
            self.minEndDate = time;
            self.pickerStart = time.getTime();
            if (self.pickerEnd !== self.$t('opinion.selectTime') && self.pickerStart - self.pickerEnd > 0) {
                self.pickerEnd = self.$t('opinion.selectTime');
            }
        },
        pickerEndSelect(time) {
            const self = this;
            self.pickerEnd = time.getTime() + 3600 * 24 * 1000 - 1;
        },
        pickerOpen(type) {
            const self = this;
            self.$refs[type].open();
        },
        dateFilter() {
            const self = this;
            if (self.inquireState) {
                return;
            }
            if (self.pickerStart !== self.$t('opinion.selectTime') && self.pickerEnd !== self.$t('opinion.selectTime')) {
                sessionStorage.summaryTime = `${self.pickerStart},${self.pickerEnd}`;
                self.customDate = true;
            }
            if (self.pickerItemValue && self.pickerItemValue !== self.$t('opinion.select')) {
                sessionStorage.summaryCompany = self.pickerItemValue;
            }
            self.Logger('速览查询');
            self.state = 'first';
            self.getSummaryNews(self);
        },
        getList(state) {
            const self = this;
            self.state = state;
			self.getSummaryNews(self);
		},
        opinionScroll() {
            const self = this;
            self.scrollNum = self.$refs.summaryMain.scrollTop;
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/common.scss';
.tooltip-right {
    position: absolute;
    top: 1.2rem;
    right: 0.4rem;
    width: 8.9rem;
    height: 2.25rem;
    background: url(#{$imgBase}pop_right.png) no-repeat;
    background-size: 100% 100%;
    z-index: 20;
    .tooltip-text {
        display: inline-block;
        color: #fff;
        font-size: 0.7rem;
        line-height: 1rem;
        padding: 0.8rem 0 0.45rem 0.75rem;
    }
    .tooltip-close {
        position: absolute;
        height: 1.9rem;
        bottom: 0;
        right: 0;
    }
}
.summary-news {
    position: absolute;
    top: 0;
    height: 100%;
    padding-top: 5.6rem;
    padding-bottom: 55px;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    color: #333;
    font-size: .6rem;
    .date-picker.show{
        height: 7.5rem;
    }
    .date-picker.show.hna-show {
        height: 5.5rem;
    }
    .summary-type {
        width: 100%;
        height: 2.2rem;
        margin-top: .3rem;
        background-color: #fff;
        border-bottom: .5px solid #e7edf0;
        position: relative;
        label {
            padding: .5rem 1.5rem;
            position: relative;
            &:before{
                content: "";
                position: absolute;
                left: 50%;
                bottom: 0;
                z-index: 2;
                width: 0;
                height: 2px;
                background-color: #4A84F9;
            }
            &.active {
                em {
                    color: #4f84ef;
                }
                &:before{
                    width: 100%;
                    left: 0;
                    transition: all .3s ease-in-out;
                }
            }
            &:after {
                content: "";
                position: absolute;
                width: 1px;
                height: .8rem;
                border-radius: .3rem;
                background-color: #e7edf0;
                right: 0;
                top: .8rem;
            }
            &.three {
                padding-right: .5rem;
                &:after {
                    display: none;
                }
            }
            input {
                float: left;
                margin-top: .2rem;
                margin-right: .5rem;
                vertical-align: middle;
            }
            img {
                float: left;
                width: .7rem;
                height: .7rem;
                margin-top: .2rem;
                margin-right: .5rem;
                vertical-align: middle;
            }
            em {
                float: left;
                font-size: .75rem;
                color: #b9c5cb;
                vertical-align: middle;
            }
        }
    }
}
</style>
