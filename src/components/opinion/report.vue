<template>
    <div class="report-container">
        <div id="daily-news" class="daily-news" ref="reportMain" v-rocket="{ num: scrollNum, menu: 1 }" @scroll="reportScroll">
            <load-more  
            :news-data="newsData" 
            :ref-name="'reportMore'"
            @getList="getList">
                <div slot="header">
                    <div class="charts-dateType">
                        <div class="charts-dateType-container clearfix">
                            <div class="left" v-for="(item, index) in reportType" :key="index" :class="{'data-active': dateType === index, 'type': item.read === '0'}" @click="setDateType(index)">
                                <strong v-text="$t(item.title)"></strong>
                            </div>
                        </div>
                        <div class="common-filter" @click="pickerShow = !pickerShow">
                            <i class="iconfont" :class="pickerShow ? 'icon-arrow-up': 'icon-filter'"></i>
                        </div>
                    </div>
                    <div class="date-picker" :class="pickerShow ? 'show' : 'hide'">
                        <div class="date-picker-content clearfix">
                            <div class="date-picker-start left">
                                <em v-text="$t('opinion.from')"></em>
                                <span :class="{'placeholder': pickerStart === $t('opinion.selectTime')}" v-text="dateFormat(pickerStart, 'date')" @click="pickerOpen('pickerStart')"></span>
                            </div>
                            <div class="date-picker-end left">
                                <em v-text="$t('opinion.to')"></em>
                                <span :class="{'placeholder': pickerEnd === $t('opinion.selectTime')}" v-text="dateFormat(pickerEnd, 'date')" @click="pickerOpen('pickerEnd')"></span>
                            </div>
                        </div>
                        <div class="date-picker-find" :class="pickerStart === $t('opinion.selectTime') || pickerEnd === $t('opinion.selectTime') ? 'disabled' : ''" @click="dateFilter" v-text="$t('opinion.inquire')"></div>
                    </div>
                    <div class="opinion-tab clearfix">
                        <div class="opinion-tab-left" style="border-top: none" :class="{'active': tabType === 'news'}" @click="tabType = 'news'">
                            <!-- <img v-if="tabType === 'news'" :src="imgBase + 'selected.png'">
                            <img v-else :src="imgBase + 'select.png'"> -->
                            <em v-text="$t('opinion.major')"></em>
                        </div>
                        <div class="opinion-tab-right" style="border-top: none" :class="{'active': tabType === 'charts'}" @click="tabType = 'charts'">
                            <!-- <img v-if="tabType === 'charts'" :src="imgBase + 'selected.png'">
                            <img v-else :src="imgBase + 'select.png'"> -->
                            <em v-text="$t('opinion.analyze')"></em>
                        </div>
                    </div>
                    <div class="charts-info">
                        <div class="chart-time">
                            <span v-text="$t('opinion.cycle')"></span>
                            <span class="chart-startTime" v-text="dateFormat(chartsInfo.startTime)"></span>
                            <span>-</span>
                            <span class="chart-endTime" v-text="$t(dateFormat(chartsInfo.endTime))"></span>
                        </div>
                        <div class="chart-total clearfix">
                            <div class="info-count">
                                <span>
                                    <i class="iconfont icon-circle"></i>{{ $t('opinion.total') }}</span>
                                <span>
                                    <em v-text="chartsInfo.totalInfo"></em> {{ $t('opinion.bar') }}</span>
                            </div>
                            <div class="info-count">
                                <span>
                                    <i class="iconfont icon-circle"></i>{{ $t('opinion.sensitiveCount') }}</span>
                                <span>
                                    <em v-text="chartsInfo.sensitiveNews"></em> {{ $t('opinion.bar') }}</span>
                            </div>
                        </div>
                        <div class="chart-media clearfix">
                            <div class="info-count">
                                <span>
                                    <i class="iconfont icon-circle"></i>{{ $t('opinion.traditional') }}</span>
                                <span>
                                    <em v-text="chartsInfo.traditionalMedia"></em> {{ $t('opinion.bar') }}</span>
                            </div>
                            <div class="info-count">
                                <span>
                                    <i class="iconfont icon-circle"></i>{{ $t('opinion.newMedia') }}</span>
                                <span>
                                    <em v-text="chartsInfo.newMedia"></em> {{ $t('opinion.bar') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div slot="main" v-show="tabType === 'news'">
                    <news-list :news-data="newsData" @getList="getList">
                    </news-list>
                </div>
                <div slot="footer">
                    <div class="charts" v-show="tabType === 'charts'">
                        <strong class="chart-title" v-text="$t('opinion.mediaVolume')"></strong>
                        <div class="daily-chart" id="dailyLine"></div>
                        <div class="daily-chart-info" v-show="dateType !== 0">
                            <!--<div class="dci-content" v-text="commentData.mediaVolume"></div>-->
                        </div>
        
                        <strong class="chart-title" v-text="$t('opinion.companyVolume')"></strong>
                        <div class="daily-chart" id="dailyBar"></div>
                        <div class="daily-chart-info" v-show="dateType !== 0">
                            <!--<div class="dci-content" v-text="commentData.companyVolume"></div>-->
                        </div>
        
                        <strong class="chart-title" v-text="$t('opinion.analysisMedia')"></strong>
                        <div class="daily-chart" id="dailyPie"></div>
                        <div class="daily-chart-info" v-show="dateType !== 0">
                            <!--<div class="dci-content" v-text="commentData.mediaAttribute"></div>-->
                        </div>
        
                        <strong class="chart-title" v-text="$t('opinion.typeVolume')"></strong>
                        <div class="daily-chart" id="dailyHollow"></div>
                        <div class="daily-chart-info" v-show="dateType !== 0">
                            <!--<div class="dci-content" v-text="commentData.mediaType"></div>-->
                        </div>
        
                        <strong class="chart-title" v-text="$t('opinion.culturalVolume')"></strong>
                        <div class="daily-chart" id="dailyRadar"></div>
                        <div class="daily-chart-info" v-show="dateType !== 0">
                            <!--<div class="dci-content" v-text="commentData.cultureContent"></div>-->
                        </div>
        
                        <strong class="chart-title" v-text="$t('opinion.cloud')"></strong>
                        <div class="daily-chart" id="dailyWord"></div>
                        <div class="daily-chart-info" v-show="dateType !== 0">
                            <!--<div class="dci-content" v-text="commentData.heightWord"></div>-->
                        </div>
                    </div>
                </div>
		    </load-more >
        </div>
        <mt-datetime-picker ref="pickerStart" type="date" v-model="initStartDate" :confirmText="$t('common.ok')" :cancelText="$t('common.cancel')" :startDate="minStartDate" :endDate="maxStartDate" @confirm="pickerStartSelect">
        </mt-datetime-picker>
        <mt-datetime-picker ref="pickerEnd" type="date" v-model="initEndDate" :confirmText="$t('common.ok')" :cancelText="$t('common.cancel')" :startDate="minEndDate" :endDate="maxEndDate" @confirm="pickerEndSelect">
        </mt-datetime-picker>
    </div>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            state: 'first',
            tabSwitch: {},
            dateType: 0,
            scrollNum: 0,
            chartLoaded: 0,
            tabType: 'news',
            pickerShow: false,
            initStartDate: new Date(),
            initEndDate: new Date(),
            minStartDate: new Date(new Date().getTime() - 3600 * 24 * 1000 * 30),
            minEndDate: new Date(new Date().getTime() - 3600 * 24 * 1000 * 30),
            maxStartDate: new Date(),
            maxEndDate: new Date(),
            pickerStart: this.$t('opinion.selectTime'),
            pickerEnd: this.$t('opinion.selectTime'),
            customDate: false,
            charts: {}
        }
    },
    activated() {
        const self = this;
        self.getOpinionRead(self);
        self.$refs.reportMain.scrollTop = self.scrollNum;
        self.clearRefresh(self, 'reportMore');
    },
    computed: {
        ...mapState({
            reportType: state => state.opinion.reportType,
            chartsInfo: state => state.opinion.chartsInfo,
            chartsData: state => state.opinion.chartsData,
            newsData: state => state.opinion.newsData,
            commentData: state => state.opinion.commentData
        })
    },
    mounted() {
        const self = this;
        if (sessionStorage.reportTabType) {
            self.tabType = sessionStorage.reportTabType;
        }
        if (sessionStorage.reportTime) {
            self.pickerStart = Number(sessionStorage.reportTime.split(',')[0]);
            self.pickerEnd = Number(sessionStorage.reportTime.split(',')[1]);
            self.dateFilter();
        } else {
            if (sessionStorage.opinionDateType) {
                self.dateType = Number(sessionStorage.opinionDateType);
            }
        }
        if (self.$route.query.type) {
            self.dateType = Number(self.$route.query.type);
        }
        const chartsEle = document.querySelectorAll('.daily-chart');
        for (let i = 0; i < chartsEle.length; i++) {
            chartsEle[i].style.width = `${document.body.clientWidth}px`;
            let chartId = chartsEle[i].id;
            self.charts[chartId] = self.$echarts.init(document.getElementById(chartId));
        }
        self.Logger(`report-${self.tabType}`);
        self.setDateType(self.dateType, true);
    },
    watch: {
        tabType(newValue, oldValue) {
            const self = this;
            if (newValue) {
                self.Logger(`report-${self.tabType}`);
            }
            if (newValue !== oldValue) {
                if (self.tabType === 'charts') {
                    self.tabSwitch.total = self.newsData.total;
                    self.tabSwitch.end = self.newsData.end;
                    self.newsData.total = 1;
                    self.newsData.end = true;
                } else {
                    setTimeout(() => {
                        self.getEleHeight();
                    }, 500);
                    if ('total' in self.tabSwitch) {
                        self.newsData.total = self.tabSwitch.total;
                        self.newsData.end = self.tabSwitch.end;
                        self.tabSwitch = {};
                    }
                }
                sessionStorage.reportTabType = self.tabType;
            }
        },
        pickerShow() {
            const self = this;
            setTimeout(() => {
                self.getEleHeight();
            }, 500);
        }
    },
    methods: {
        ...mapActions([
            'getReportInfo',
            'getOpinionRadar',
            'getOpinionWord',
            'getOpinionNews',
            'getOpinionRead',
            'updateOpinionRead',
            'getOpinionComment'
        ]),
        pickerStartSelect(time) {
            const self = this;
            self.minEndDate = time;
            self.pickerStart = time.getTime();
            if (/^[0-9]*$/.test(self.pickerEnd) && self.pickerStart - self.pickerEnd > 0) {
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
            if (!/^[0-9]*$/.test(self.pickerStart) || !/^[0-9]*$/.test(self.pickerEnd)) {
                return;
            }
            sessionStorage.reportTime = `${self.pickerStart},${self.pickerEnd}`;
            self.customDate = true;
            self.Logger('报告查询');
            self.state = 'first';
            self.getOpinionNews(self);
            self.getReportInfo(self);
            self.chartLoaded = 1;
            self.getOpinionComment(self);
        },
        setDateType(type, first, state) {
            const self = this;
            self.charts.dailyWord.off('click');
            self.customDate = false;
            self.pickerShow = false;
            self.pickerStart = self.$t('opinion.selectTime');
            self.pickerEnd = self.$t('opinion.selectTime');
            sessionStorage.removeItem('reportTime');
            if (!state) {
                self.state = 'first';
            }
            self.dateType = type;
            if (self.reportType[type].read === '0' && !first) {
                self.updateOpinionRead(self);
            }
            self.Logger(self.reportType[type].name);
            self.getOpinionNews(self);
            self.getReportInfo(self);
            self.chartLoaded = 1;
            self.getOpinionComment(self);
            sessionStorage.opinionDateType = type;
        },
        getList(state) {
             const self = this;
             self.state = state;
             if (state === 'refresh') {
                self.setDateType(self.dateType, null, state);
             } else if (state === 'next') {
                self.getOpinionNews(self);
             } else {
                 self.setDateType(self.dateType, true);
             }
        },
        reportScroll() {
            const self = this;
            self.scrollNum = self.$refs.reportMain.scrollTop;
            if (self.tabType === 'charts') {
                if (self.scrollNum > 90 && self.chartLoaded < 2) {
                    self.chartLoaded = 2;
                } else if (self.scrollNum > 400 && self.chartLoaded < 3) {
                    self.chartLoaded = 3;
                } else if (self.scrollNum > 650 && self.chartLoaded < 4) {
                    self.chartLoaded = 4;
                } else if (self.scrollNum > 900 && self.chartLoaded < 5) {
                    self.chartLoaded = 5;
                    self.getOpinionRadar(self);
                } else if (self.scrollNum > 1150 && self.chartLoaded < 6) {
                    self.chartLoaded = 6;
                    self.getOpinionWord(self);
                }
            }
        }
    }
}
</script>
<style lang="scss">
.daily-news {
    position: absolute;
    top: 0;
    height: 100%;
    padding-top: 5.6rem;
    padding-bottom: 55px;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .charts-dateType {
        height: 2.2rem;
        margin: .3rem 0 0 0;
        background-color: #fff;
        position: relative;
        padding-top: .4rem;
        border-top: .5px solid #e7edf0;
        border-bottom: .5px solid #e7edf0;
        .charts-dateType-container {
            width: 10rem;
            height: 1.4rem;
            line-height: 1.4rem;
            margin: 0 auto;
            border-radius: .7rem;
            border: solid 0.5px #a1b4da;
            box-sizing: content-box;
            .left {
                width: 33.333333%;
                height: 100%;
                text-align: center;
                border-radius: .7rem;
                background-color: transparent;
                position: relative;
                &.type:after{
                    content: "";
                    position: absolute;
                    width: .25rem;
                    height: .25rem;
                    background: #fa3f3f;
                    border-radius: 50%;
                    right: .4rem;
                    top: 50%;
                    margin-top: -.125rem;
                }
                &.data-active {
                    background-color: #4f84ef;
                    transition: all .3s ease-in-out;
                    strong {
                        color: #fff;
                    }
                }
                strong {
                    color: #a1b4da;
                    display: block;
                    font-weight: normal;
                    font-size: .6rem;
                }
            }
        }
    }
}
</style>
