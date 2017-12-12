<template>
    <div class="special-container">
        <div class="loadmore-scroll" id="special-main" v-rocket="{ num: scrollNum, menu: 1 }" @scroll="specialScroll" ref="specialMain">
            <load-more 
            :news-data="newsData" 
            :ref-name="'specialMore'"
            @getList="getList">
                <div slot="header">
                    <div class="made-icon clearfix">
                        <div class="screen-icon" @click="popupVisible = !popupVisible">
                            <span>{{ $t("opinion.screen") }}</span>
                            <i class="iconfont icon-filter"></i>
                        </div>
                        <router-link :to="{name: 'madeKeywords', params: {customType: customType}}">
                            <div class="screen-icon">
                                <span>{{ $t("opinion.madeSpecial") }}</span>
                                <i class="iconfont icon-setting"></i>
                            </div>
                        </router-link>
                    </div>
                    <div class="opinion-tab clearfix">
                        <div class="opinion-tab-left" :class="{'active': tabType === 'news'}" @click="tabType = 'news'">
                            <!-- <img v-if="tabType === 'news'" :src="imgBase + 'selected.png'">
                            <img v-else :src="imgBase + 'select.png'"> -->
                            <em>{{ $t("opinion.major") }}</em>
                        </div>
                        <div class="opinion-tab-right" :class="{'active': tabType === 'charts'}" @click="tabType = 'charts'">
                            <!-- <img v-if="tabType === 'charts'" :src="imgBase + 'selected.png'">
                            <img v-else :src="imgBase + 'select.png'"> -->
                            <em>{{ $t("opinion.analyze") }}</em>
                        </div>
                    </div>
                    <div class="special-none" v-show="!filterSpecial.length">
                        <div class="sn-main">
                            <div class="snm-img">
                                <img :src="imgBase + 'icon_paper.png'" alt="special">
                            </div>
                            <div class="snm-text">{{ $t("opinion.noMadespecial") }}~</div>
                            <div class="snm-text">{{ $t("opinion.clickSpecial") }}</div>
                        </div>
                    </div>
                </div>
                <div slot="main" v-show="tabType === 'news' && filterSpecial.length">
                    <news-list :news-data="newsData" @getList="getList">
                    </news-list>
                </div>
                <div slot="footer">
                   <div class="charts" v-show="tabType === 'charts'">
                        <div v-show="filterSpecial.length">
                            <strong class="chart-title">{{ $t("opinion.mediaVolume") }}</strong>
                            <div class="daily-chart" id="dailyLine"></div>
                            <div class="daily-chart-info">
                                <!--<div class="dci-content" v-text="commentData.mediaVolume"></div>-->
                            </div>

                            <strong class="chart-title">{{ $t("opinion.analysisMedia") }}</strong>
                            <div class="daily-chart" id="dailyPie"></div>
                            <div class="daily-chart-info">
                                <!--<div class="dci-content" v-text="commentData.mediaAttribute"></div>-->
                            </div>
                
                            <strong class="chart-title">{{ $t("opinion.typeVolume") }}</strong>
                            <div class="daily-chart" id="dailyHollow"></div>
                            <div class="daily-chart-info">
                                <!--<div class="dci-content" v-text="commentData.mediaType"></div>-->
                            </div>
                        </div>
                    </div>
                </div>
		    </load-more>
        </div>
        <mt-popup v-model="popupVisible" position="bottom">
            <div class="screen-box">
                <!-- <div class="screen-title" v-text="$t("opinion.screen")"></div>
                    <div class="screen-row">
                        <span class="active" v-for="(item, index) in filterArr">{{item}}</span>
                        <span class="active" v-for="(item, index) in filterWord">{{item}}</span>
                    </div> -->
                <div class="screen-header">
                    <div class="screen-title" @click="popupTab = 'time'" :class="{'active': popupTab === 'time'}">{{ $t("opinion.time") }}</div>
                    <div class="screen-title" @click="popupTab = 'special'" :class="{'active': popupTab === 'special'}">{{ $t("opinion.specials") }}</div>
                </div>
                <div id="fillTime" class="screen-row text-center" v-show="popupTab === 'time'">
                    <span v-for="(item, index) in filterTime" :key="index" :class="{'active': index === timeIndex}" @click="filterDate(index)" v-text="$t(item)"></span>
                </div>
                
                <div class="screen-row clearfix">
                    <div id="fillSpecial" class="row-box" v-show="popupTab === 'special'">
                        <span v-for="item in filterSpecial" :key="item.id" :class="{'active': filterActive(item.subjectName)}" @click="filterSubject(item.subjectName, item.id)">{{item.subjectName}}</span>
                    </div>
                </div>
            </div>
            <div class="screen-btn clearfix">
                <a class="finish-btn reset-btn" @click="restScreen()">{{ $t("opinion.reset") }}</a>
                <a class="finish-btn" @click="finishScreen(),Logger('添加专题')">{{ $t("common.finish") }}</a>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            state: 'first',
            tabSwitch: {},
            tabType: 'news',
            scrollNum: 0,
            timeIndex: 0,
            postTime: 1,
            isClick: false,
            filterArr: [],
            filterWord: [],
            filterWordId: [],
            postSubject: false,
            popupVisible: false,
            charts: {},
            popupTab: 'time'
        }
    },
    computed: {
        ...mapState({
            newsData: state => state.special.keywordNews,
            filterTime: state => state.special.filterTime,
            postTimeArr: state => state.special.postTimeArr,
            filterSpecial: state => state.sensitive.filterSpecial,
            totalPage: state => state.special.totalPage,
            customType: state => state.sensitive.customType
        })
    },
    mounted() {
        const self = this;
        if (sessionStorage.specialTabType) {
             self.tabType = sessionStorage.specialTabType;
        }
        self.fixCustomType(1);
        self.state = 'first';
        self.getKeyWord(self);
        self.getSpecialNews(self);
        const chartsEle = document.querySelectorAll('.daily-chart');
        for (let i = 0; i < chartsEle.length; i++) {
            chartsEle[i].style.width = `${document.body.clientWidth}px`;
            let chartId = chartsEle[i].id;
            self.charts[chartId] = self.$echarts.init(document.getElementById(chartId));
        }
        self.Logger(`special-${self.tabType}`);
        self.getSpecialCharts(self);
    },
    activated() {
        const self = this;
        self.getEleHeight('.special-none', 'height');
        self.fixCustomType(1);
        self.getKeyWord(self);
        if (!self.filterSpecial.length) {
            self.$refs.specialMain.scrollTop = 0;
        } else {
            self.$refs.specialMain.scrollTop = self.scrollNum;
        }
        self.clearRefresh(self, 'specialMore');
    },
    watch: {
        tabType(newValue, oldValue) {
            const self = this;
            if (newValue) {
                self.Logger(`special-${self.tabType}`);
            }
            if (newValue !== oldValue) {
                if (self.tabType === 'charts' || !self.filterSpecial.length) {
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
                sessionStorage.specialTabType = self.tabType;
            }
        },
        filterSpecial(oldValue, newValue) {
            if (newValue !== oldValue) {
                const self = this;
                if (self.filterSpecial.length) {
                    if ('total' in self.tabSwitch) {
                        self.newsData.total = self.tabSwitch.total;
                        self.newsData.end = self.tabSwitch.end;
                        self.tabSwitch = {};
                    }
                } else {
                    self.tabSwitch.total = self.newsData.total;
                    self.tabSwitch.end = self.newsData.end;
                    self.newsData.total = 1;
                    self.newsData.end = true;
                }
            }
        }
    },
    methods: {
        ...mapMutations(['fixCustomType']),
        ...mapActions([
            'getKeyWord',
            'getSpecialNews',
            'getSpecialCharts'
        ]),
        filterDate(index) {
            const self = this;
            /*
            // 查找该时间是否有active类
            const timeTab = self.$('#fillTime > span');
            if (timeTab.eq(index).hasClass('active')) {
                self.timeIndex = null;
                self.postTime = null;
                self.filterArr = [];
            } else {
                self.timeIndex = index;
                self.postTime = self.postTimeArr[self.timeIndex];
                self.filterArr[0] = (self.filterTime[self.timeIndex]);
            }
             */
            self.timeIndex = index;
            self.postTime = self.postTimeArr[self.timeIndex];
            self.filterArr[0] = (self.filterTime[self.timeIndex]);
        },
        filterSubject(item, id) {
            const self = this;
            if (self.filterWord.includes(item)) {
                self.filterWord.splice(self.filterWord.indexOf(item), 1);
                self.filterWordId.splice(self.filterWordId.indexOf(id), 1);
            } else {
                self.filterWord.push(item);
                self.filterWordId.push(id);
            }
        },
        filterActive(item) {
            const self = this;
            return self.filterWord.includes(item);
        },
        restScreen() {
            const self = this;
            self.timeIndex = 0;
            self.postTime = 1;
            self.filterArr = [];
            self.filterWord = [];
            self.filterWordId = [];
        },
        finishScreen() {
            const self = this;
            self.state = 'first';
            self.getSpecialNews(self);
            self.getSpecialCharts(self);
            self.popupVisible = false;
        },
        getList(state) {
             const self = this;
             self.state = state
             if (state === 'refresh') {
                 self.getSpecialCharts(self);
             }
            self.getSpecialNews(self);
        },
        specialScroll() {
            const self = this;
            self.scrollNum = self.$refs.specialMain.scrollTop;
        }
    }
}
</script>
<style lang="scss">
.special-container {
    position: absolute;
    top: 0;
    height: 100%;
    padding-top: 5.6rem;
    padding-bottom: 55px;
    width: 100%;
    font-size: .7rem;
    .special-none{
        width: 100%;
        height: 100%;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        .sn-main{
            text-align: center;
            margin-top: -1.5rem;
            .snm-img{
                img{
                    width: 3rem;
                    height: 3rem;
                    margin-bottom: .5rem;
                }
            }
            .snm-text{
                color: #c5cbdf;
                font-size: .75rem;
                line-height: normal;
                padding-bottom: .25rem;
            }
        }
    }
    .loadmore-scroll {
        position: absolute;
        top: 0;
        padding-top: 5.6rem;
        padding-bottom: 55px;
        width: 100%;
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
    .mint-popup-bottom {
        height: auto;
        width: 100%;
        top: 64.2%;
        text-align: left;
        background-color: #fff;
        .screen-btn {
            position: absolute;
            bottom: 0;
            width: 100%;
            .finish-btn {
                display: block;
                float: left;
                width: 50%;
                height: 2.7rem;
                line-height: 2.7rem;
                text-align: center;
                font-size: .8rem;
                color: #fff;
                background-color: #a1b4da;
                &:last-child {
                    background-color: #4e87f9;
                }
            }
        }
    }
    .made-icon {
        background-color: #fff;
        margin-top: .3rem;
        .screen-icon {
            float: left;
            width: 50%;
            text-align: center;
            padding: .45rem 0;
            color: #4e87f9;
            font-size: .75rem;
            position: relative;
            .iconfont {
                margin-left: .5rem;
                font-size: .8rem;
            }
            .icon-setting{
                font-size: 1rem;
                line-height: normal;
                vertical-align: text-top;
            }
            &:first-child {
                &:after {
                    content: "";
                    display: block;
                    height: .8rem;
                    width: 1px;
                    background-color: #e7edf0;
                    position: absolute;
                    right: 0;
                    top: .65rem;
                }
            }
        }
    }
    .screen-box {
        .screen-header {
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-justify-content: -webkit-space-around;
            justify-content: space-around;
            -webkit-align-items: center;
            align-items: center;
            height: 2.4rem;
            .screen-title {
                font-size: .8rem;
                color: #A6B8DC;
                position: relative;
                width: 100%;
                height: 100%;
                line-height: 2.4rem;
                text-align: center;
                border-bottom: 1px solid #e7edf0;
                &.active {
                    color: #4E87F9;
                    &:before {
                        width: 100%;
                        left: 0;
                        transition: all .3s ease-in-out;
                    }
                }
                &:before {
                    content: "";
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    z-index: 2;
                    width: 0;
                    height: 2px;
                    background-color: #4A84F9;
                }
                &:first-child{
                    &:after {
                        position: absolute;
                        top: .7rem;
                        right: 0;
                        content: "";
                        width: 1px;
                        display: block;
                        height: .8rem;
                        border-radius: .3rem;
                        background-color: #e7edf0;
                    }
                }
            }
        }
        .screen-row {
            margin-top: .9rem;
            padding: 0.4rem 0;
            position: relative;
            font-size: 0;
            .row-box {
                padding: 0 0.6rem;
            }
            span {
                display: inline-block;
                padding: 0.2rem 1rem;
                background: #f4f7f8;
                border: 1px solid #f4f7f8;
                color: #4E87F9;
                border-radius: 1rem;
                margin: 0 0.5rem;
                font-size: .7rem;
                margin-bottom: 1rem;
                &.active {
                    background: #4e87f9;
                    color: #fff;
                }
            }
            .screen-show {
                color: #666;
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                -webkit-transition: all .5s;
                transition: all .5s;
                &.show-rotate {
                    -webkit-transform: rotate(-225deg);
                    transform: rotate(-225deg);
                }
                i {
                    font-size: 1.4rem;
                }
            }
        }
        .screen-special-row {
            padding: 0.4rem 0;
            height: 2.2rem;
            position: relative;
            font-size: .6rem;
            .row-title {
                color: #0381e6;
                width: 2rem;
                letter-spacing: 0.2rem;
                margin-top: .2rem;
            }
            .row-box {
                font-size: 0;
                width: calc(100% - 2rem);
                overflow-x: auto;
                white-space: nowrap;
                -webkit-overflow-scrolling: touch;
                &::-webkit-scrollbar {
                    height: 0;
                }
                span {
                    font-size: .6rem;
                    display: inline-block;
                    padding: 0.1rem .8rem;
                    background: #fff;
                    border: 1px solid #0381e6;
                    color: #0381e6;
                    border-radius: 1rem;
                    margin-left: 0.5rem;
                    &.active {
                        background: #0381e6;
                        color: #fff;
                    }
                }
            }
        }
    }
    .daily-chart{
        box-sizing: border-box;
    }
    .chart-title:first-child{
        border-top: 1px solid #f2f2f2 !important;
    }
}
</style>
