<template>
    <div class="index-hotTopic-wrapper" @scroll="hotTopScroll" ref="hotTopMain">
        <load-more 
		:news-data="newsData" 
		:ref-name="'hotTopMore'"
		@getList="getList">
            <div slot="header">
                <div class="wordCloud-wrapper">
                    <h2 class="title" v-text="$t('index.wordCloud')"></h2>
                    <div class="daily-chart" id="dailyGraph"></div>
                </div>
                <div class="tab-menu">
                    <div class="tab-center"><em v-text="$t('index.groupInfo')"></em></div>
                    <!--<div class="tab-left" :class="{'active': tabType === 'news'}" @click="tabType = 'news'">
                        <img v-if="tabType === 'news'" :src="imgBase + 'selected.png'">
                        <img v-else :src="imgBase + 'select.png'">
                        <em v-text="$t('index.relatedInfo')"></em>
                    </div>
                    <div class="tab-right" :class="{'active': tabType === 'charts'}" @click="tabType = 'charts'">
                        <img v-if="tabType === 'charts'" :src="imgBase + 'selected.png'">
                        <img v-else :src="imgBase + 'select.png'">
                        <em v-text="$t('opinion.analyze')"></em>
                    </div>-->
                </div>
            </div>
            <div slot="footer" class="charts" v-show="tabType === 'charts'">
                <strong class="chart-title" v-text="$t('index.todayOpinion')"></strong>
                <div class="daily-chart" id="dailyPie"></div>
    
                <strong class="chart-title" v-text="$t('index.mediaSource')"></strong>
                <div class="daily-chart" id="dailyBar"></div>

                <strong class="chart-title" v-text="$t('index.emotion')"></strong>
                <div class="daily-chart" id="dailyLine"></div>
            </div>
        </load-more>
        <i class="goTop iconfont icon-rocket bottom-10" v-show="scrollNum > rocketShow" @click="backTop()"></i>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
    data() {
        return {
            state: 'first',
            tabSwitch: false,
            reload: false,
            keyword: '',
            tabType: 'news',
            dateType: 'month',
            scrollNum: 0,
            charts: {},
            subTopicText: ''
        }
    },
    computed: {
        ...mapState({
            newsData: state => state.hotSpot.newsData
        })
    },
    beforeRouteLeave(to, from, next) {
        const self = this;
		if (to.name !== 'detail' && to.name !== 'chartDetail') {
			self.reload = true;
		} else {
			self.reload = false;
		}
		next();
	},
    mounted() {
        const self = this;
        self.keyword = self.$route.query.keyword;
        self.hottopicId = self.$route.query.hottopicId;
        self.subTopicText = self.keyword;
        if (sessionStorage.hotSpotTabType) {
            self.tabType = sessionStorage.hotSpotTabType;
        }
        const chartsEle = document.querySelectorAll('.daily-chart');
        for (let i = 0; i < chartsEle.length; i++) {
            chartsEle[i].style.width = `${document.body.clientWidth}px`;
            let chartId = chartsEle[i].id;
            if (chartId === 'dailyGraph') {
                chartsEle[i].style.height = `${document.body.clientWidth}px`;
            }
            self.charts[chartId] = self.$echarts.init(document.getElementById(chartId));
        }
        self.getHotSpotGraph(self);
        // self.getHotSpotCharts(self);
        self.getHotSpotNews(self);
    },
    activated() {
        const self = this;
        self.clearRefresh(self, 'hotTopMore');
        if (self.reload) {
            self.scrollNum = 0;
            self.keyword = self.$route.query.keyword;
            self.hottopicId = self.$route.query.hottopicId;
            self.subTopicText = self.keyword;
            if (sessionStorage.hotSpotTabType) {
                self.tabType = sessionStorage.hotSpotTabType;
            }
            const chartsEle = document.querySelectorAll('.daily-chart');
            for (let i = 0; i < chartsEle.length; i++) {
                chartsEle[i].style.width = `${document.body.clientWidth}px`;
                let chartId = chartsEle[i].id;
                if (chartId === 'dailyGraph') {
                    chartsEle[i].style.height = `${document.body.clientWidth}px`;
                }
                self.charts[chartId] = self.$echarts.init(document.getElementById(chartId));
            }
            self.state = 'first';
            self.getHotSpotGraph(self);
            // self.getHotSpotCharts(self);
            self.getHotSpotNews(self);
        } else {
            if (self.keyword !== self.$route.query.keyword) {
                self.keyword = self.$route.query.keyword;
                self.hottopicId = self.$route.query.hottopicId;
            }
            self.$refs.hotTopMain.scrollTop = self.scrollNum;
        }
        self.$nextTick(function() {
            self.charts.dailyGraph.on('click', function(ball) {
                self.state = 'first';
                self.subTopicText = ball.name;
                self.getHotSpotNews(self);
            });
        });
    },
    watch: {
        tabType(oldValue, newValue) {
            if (newValue !== oldValue) {
                const self = this;
                if (self.tabType === 'charts') {
                    self.tabSwitch = true;
                } else {
                    self.tabSwitch = false;
                }
                sessionStorage.hotSpotTabType = self.tabType;
            }
        }
    },
    methods: {
        ...mapActions([
            'getHotSpotGraph',
            'getHotSpotCharts',
            'getHotSpotNews'
        ]),
        getList(state) {
			const self = this;
            self.state = state;
            if (state === 'refresh') {
                self.getHotSpotGraph(self);
                // self.getHotSpotCharts(self);
            }
            self.getHotSpotNews(self);
		},
        hotTopScroll() {
            const self = this;
            self.scrollNum = self.$refs.hotTopMain.scrollTop;
        },
        backTop() {
            const self = this;
            if (self.$refs.hotTopMain.scrollTop > 0) {
                self.$refs.hotTopMain.scrollTop -= self.$refs.hotTopMain.offsetHeight / 5;
                requestAnimationFrame(self.backTop);
            }
        }
    }
}
</script>
<style lang="scss">
.index-hotTopic-wrapper {
    height: 100%;
    overflow: auto;
    padding-top: 3.3rem;
    background-color: #f3f7fa;
    -webkit-overflow-scrolling: touch;
    .charts {
        background-color: #F4F7F9;
        margin-bottom: .25rem;
        .daily-chart {
            width: 100%;
            height: 12rem;
            padding: 0 .5rem .5rem;
            background-color: #fff!important;
        }
        .daily-chart-info {
            background-color: #fff;
            margin-bottom: .3rem;
            padding: 0 .5rem 1.9rem;
            .dci-content {
                font-size: .6rem;
                color: #666;
                text-align: justify;
                text-indent: 1rem;
            }
        }
        #dailyLine {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        #dailyBar {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            height: 15rem;
        }
        #dailyWord {
            height: 10rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        #dailyRadar {
            height: 13rem;
        }
        .chart-title {
            background-color: #fff;
            padding: 1.55rem 0 1rem;
            color: #333;
            display: block;
            font-weight: normal;
            font-size: .7rem;
            text-align: center;
            border-top: 1px solid #f2f2f2;
            &:first-child {
                border-top: none;
            }
        }
    }
    .wordCloud-wrapper {
        background-color: #fff;
        text-align: center;
        margin: 0.3rem 0;
        .title {
            font-size: 0.8rem;
            color: #333;
            font-weight: 700;
            line-height: 2.2rem;
        }
        img {
            width: 15.5rem;
            height: 10.6rem;
        }
        #dailyGraph {
            width: 100%;
            height: 320px;
        }
    }
    .tab-menu {
        width: 100%;
        height: 2.2rem;
        background-color: #fff;
        margin-top: .3rem;
        border-bottom: 1px solid #E7EDF0;
        font-size: 0;
        .tab-left,
        .tab-center,
        .tab-right {
            float: left;
            width: 50%;
            line-height: 2.2rem;
            text-align: center;
            border-top: .5px solid #e7edf0;
            border-bottom: .5px solid #e7edf0;
            position: relative;
            &.active {
                em {
                    color: #4f84ef;
                    transition: all .3s ease-in-out;
                }
            }
            em {
                font-size: .75rem;
                color: #c1cadc;
                vertical-align: middle;
            }
            img {
                width: .7rem;
                height: .7rem;
                margin-right: .2rem;
                vertical-align: middle;
            }
        }
        .tab-left:after {
            position: absolute;
            top: .7rem;
            right: 0;
            content: "";
            width: 1px;
            height: .8rem;
            border-radius: .3rem;
            background-color: #e7edf0;
        }
        .tab-center{
            width: 100%;
            text-align: center;
            border-bottom: 0;
            em{
                color: #4f84ef;
            }
        }
        span {
            display: inline-block;
            width: 50%;
            text-align: center;
            line-height: 2.2rem;
            font-size: 0.8rem;
        }
    }
    .chars-wrap {
        background-color: #fff;
        text-align: center;
        img {
            width: 18.75rem;
            height: auto;
        }
    }
}
</style>
