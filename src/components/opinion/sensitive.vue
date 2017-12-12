<template>
    <div class="made-container">
        <!-- <div class="made-icon clearfix">
            <div class="screen-icon" @click="popupVisible = !popupVisible">
                <span v-text="$t('opinion.screen')"></span>
                <i class="iconfont icon-filter"></i>
            </div>
            <router-link :to="{name: 'madeKeywords', params: {customType: customType}}">
                <div class="screen-icon">
                    <span v-text="$t('common.topic')"></span>
                    <i class="iconfont icon-setting"></i>
                </div>
            </router-link>
        </div> -->
        <div class="loadmore-scroll" id="sensitive-main" v-rocket="{ num: scrollNum, menu: 1 }" :class="{'loadmore-open': pickerShow}" @scroll="sensitiveScroll" ref="sensitiveMain">
            <load-more 
            :news-data="newsData" 
            :ref-name="'sensitiveMore'"
            @getList="getList">
                <div slot="header">
                    <div class="date-picker show">
                        <div class="search-box">
                            <i class="mintui mintui-search"></i>
                            <input type="search" class="search-input" :class="{'search-max': pickerShow}" :placeholder="$t('opinion.keywordEnter')" v-model="searchText" @keyup.enter="searchKeyword"></input>
                            <!-- <span class="search-btn" v-show="!pickerShow" @click="searchKeyword" v-text="$t('common.search')"></span> -->
                        </div>
                        <div class="date-picker-content clearfix">
                            <div class="date-picker-start left">
                                <em v-text="$t('opinion.from')"></em>
                                <span v-text="dateFormat(pickerStart, 'date')" :class="{'placeholder': pickerStart === $t('opinion.selectTime')}" @click="pickerOpen('pickerStart')"></span>
                            </div>
                            <div class="date-picker-end left">
                                <em v-text="$t('opinion.to')"></em>
                                <span v-text="dateFormat(pickerEnd, 'date')" :class="{'placeholder': pickerEnd === $t('opinion.selectTime')}" @click="pickerOpen('pickerEnd')"></span>
                            </div>
                        </div>
                        <div class="date-picker-find left" :class="{'disabled' : resetState}" @click="clearDate" v-text="$t('opinion.reset')"></div>
                        <div class="date-picker-find right" :class="{'disabled' : inquireState}" @click="dateFilter" v-text="$t('opinion.inquire')"></div>
                    </div>
                </div>
            </load-more>
        </div>
        <mt-popup v-model="popupVisible" position="right">
            <div class="screen-box">
                <!-- <div class="screen-title" v-text="$t('opinion.screen')"></div>
                <div class="screen-row">
                    <span class="active" v-for="(item, index) in filterArr">{{item}}</span>
                    <span class="active" v-for="(item, index) in filterWord">{{item}}</span>
                </div> -->
                <div class="screen-title" v-text="$t('opinion.time')"></div>
                <div id="fillTime" class="screen-row">
                    <span v-for="(item, index) in filterTime" :key="index" :class="{'active': index === timeIndex}" @click="filterDate(index)" v-text="$t(item)"></span>
                </div>
                <div class="screen-title" v-text="$t('opinion.specials')"></div>
                <div class="screen-row clearfix">
                    <div id="fillSpecial" class="pull-left row-box">
                        <span v-for="item in filterSpecial" :key="item.id" :class="{'active': filterActive(item.subjectName)}" @click="filterSubject(item.subjectName, item.id)">{{item.subjectName}}</span>
                    </div>
                </div>
            </div>
            <div class="screen-btn clearfix">
                <a class="finish-btn reset-btn" @click="restScreen()" v-text="$t('opinion.reset')"></a>
                <a class="finish-btn" @click="finishScreen()" v-text="$t('opinion.finish')"></a>
            </div>
        </mt-popup>
        <mt-datetime-picker ref="pickerStart" type="date" v-model="initStartDate" :confirmText="$t('common.ok')" :cancelText="$t('common.cancel')" :startDate="minStartDate" :endDate="maxStartDate" @confirm="pickerStartSelect">
        </mt-datetime-picker>
        <mt-datetime-picker ref="pickerEnd" type="date" v-model="initEndDate" :confirmText="$t('common.ok')" :cancelText="$t('common.cancel')" :startDate="minEndDate" :endDate="maxEndDate" @confirm="pickerEndSelect">
        </mt-datetime-picker>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            state: 'first',
            scrollNum: 0,
            timeIndex: 0,
            postTime: 1,
            isClick: false,
            filterArr: [],
            filterWord: [],
            filterWordId: [],
            postSubject: false,
            popupVisible: false,
            pickerShow: false,
            initStartDate: new Date(),
            initEndDate: new Date(),
            minStartDate: new Date(new Date().getTime() - 31536000000),
            minEndDate: new Date(new Date().getTime() - 31536000000),
            maxStartDate: new Date(),
            maxEndDate: new Date(),
            pickerStart: this.$t('opinion.selectTime'),
            pickerEnd: this.$t('opinion.selectTime'),
            searchText: '',
            searchWord: '',
            loadmoreOpen: false
        }
    },
    computed: {
        resetState() {
            const self = this;
            return !/^[0-9]*$/.test(self.pickerStart) && !/^[0-9]*$/.test(self.pickerEnd) && !self.searchText;
        },
        inquireState() {
            const self = this;
            return (!/^[0-9]*$/.test(self.pickerStart) && /^[0-9]*$/.test(self.pickerEnd)) || (/^[0-9]*$/.test(self.pickerStart) && !/^[0-9]*$/.test(self.pickerEnd)) || self.resetState;
        },
        ...mapState({
            newsData: state => state.sensitive.keywordNews,
            filterTime: state => state.sensitive.filterTime,
            postTimeArr: state => state.sensitive.postTimeArr,
            filterSpecial: state => state.sensitive.filterSpecial,
            totalPage: state => state.sensitive.totalPage,
            customType: state => state.sensitive.customType
        })
    },
    mounted() {
        const self = this;
        self.fixCustomType(0);
        self.getKeyWord(self);
        self.getSensitiveNews(self);
    },
    activated() {
        const self = this;
        self.fixCustomType(0);
        self.getKeyWord(self);
        self.$refs.sensitiveMain.scrollTop = self.scrollNum;
        self.clearRefresh(self, 'sensitiveMore');
    },
    methods: {
        ...mapMutations(['fixCustomType', 'sensitiveClear']),
        ...mapActions([
            'getKeyWord',
            'getSensitiveNews'
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
            self.getSensitiveNews(self);
            self.popupVisible = false;
        },
        getList(state) {
             const self = this;
             self.state = state;
             if (state === 'refresh') {
                self.fixCustomType(0);
                self.getKeyWord(self);
             }
            self.getSensitiveNews(self);
        },
        sensitiveScroll() {
            const self = this;
            self.scrollNum = self.$refs.sensitiveMain.scrollTop;
        },
        clearDate() {
            const self = this;
            if (self.resetState) return;
            self.searchText = '';
            self.searchWord = '';
            self.pickerStart = self.$t('opinion.selectTime');
            self.pickerEnd = self.$t('opinion.selectTime');
            self.state = 'first';
            self.Logger('敏感重置');
            self.minStartDate = new Date(new Date().getTime() - 31536000000);
            self.minEndDate = new Date(new Date().getTime() - 31536000000);
            sessionStorage.removeItem('sensitiveTime');
            self.getSensitiveNews(self);
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
            self.Logger('敏感查询');
            self.searchWord = self.searchText;
            sessionStorage.sensitiveTime = `${self.pickerStart},${self.pickerEnd}`;
            self.state = 'first';
            self.getSensitiveNews(self);
        },
        searchKeyword() {
            const self = this;
            self.state = 'first';
            self.getSensitiveNews(self);
            document.activeElement.blur();
        }
    }
}
</script>
<style lang="scss">
    .made-container {
        font-size: .7rem;
        height: 100%;
        .loadmore-scroll {
            width: 100%;
            height: 100%;
            padding-top: 5.6rem;
            padding-bottom: 55px;
            top: 0;
            overflow: auto;
            position: absolute;
            -webkit-overflow-scrolling: touch;
            &.loadmore-open {
                height: calc(100% - 2.5rem - 5.9rem);
            }
        }
        .mint-popup-right {
            height: 100vh;
            width: 73%;
            top: 50%;
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
        .search-box {
            height: 100%;
            white-space: nowrap;
            overflow: hidden;
            position: relative;
            height: 2.2rem;
            .mintui-search {
                position: absolute;
                left: 4rem;
                top: 54%;
                line-height: 0;
                font-size: 1rem;
                color: #4F84EF;
                -webkit-transform: trasnlateY(-50%);
                -moz-transform: trasnlateY(-50%);
                transform: trasnlateY(-50%);
            }
            .search-input {
                height: 1.5rem;
                width: 12.8rem;
                display: block;
                margin: .35rem auto 0;
                border-radius: .75rem;
                border: none;
                background: #F4F7F8;
                padding-left: 3rem;
                color: #152734;
                padding-right: .5rem;
                transition: all .3s;
                &:focus {
                    outline: none;
                }
                &::-webkit-input-placeholder  {
                    color: #C5CEDE;
                }
                &.search-max {
                    width: calc(100% - 1.3rem);
                }
            }
            .search-btn {
                display: inline-block;
                font-size: .8rem;
                color: #A1B4DA;
                margin-left: .5rem;
                position: absolute;
                top: 50%;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
            }
        }
        .made-icon {
            background-color: #fff;
            margin-top: .3rem;
            border-bottom: 1px solid #eee;
            .screen-icon {
                float: left;
                width: 50%;
                text-align: center;
                padding: .6rem 0;
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
                        height: 1.35rem;
                        width: 1px;
                        background-color: #e7edf0;
                        position: absolute;
                        right: 0;
                        top: .6rem;
                    }
                }
            }
        }
        .date-picker.show {
            height: 7.8rem;
            margin-top: .4rem;
        }
        .screen-box {
            padding-top: 2.4rem;
            .screen-title {
                font-size: .8rem;
                color: #1b2d39;
                padding-left: 1rem;
            }
            .screen-row {
                margin-top: .9rem;
                padding: 0.4rem 0;
                position: relative;
                font-size: 0;
                span {
                    display: inline-block;
                    padding: 0.1rem 1rem;
                    background: #f4f7f8;
                    border: 1px solid #f4f7f8;
                    color: #4e87f9;
                    border-radius: 1rem;
                    margin-left: .9rem;
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
                    &::-webkit-scrollbar{
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
        .charts-info {
            margin-top: .5rem;
            height: 6rem;
            background-color: #fff;
            padding: .7rem 1.5rem;
            box-sizing: border-box;
            color: #999;
            font-size: .6rem;
            .chart-total,
            .chart-media {
                margin-top: .7rem;
                span {
                    float: left;
                    width: 50%;
                }
            }
        }
        .charts {
            background-color: #fff;
            margin-bottom: 55px;
            .daily-chart {
                width: 100%;
                height: 12rem;
                padding: 0 .5rem .5rem;
            }
            .daily-chart-info {
                padding: 0 .5rem 1.9rem;
                .dci-content {
                    font-size: .6rem;
                    color: #666;
                    text-align: justify;
                    text-indent: 1rem;
                }
            }
            #dailyBar {
                height: 16rem;
            }
            #dailyRadar {
                height: 13rem;
            }
            .chart-title {
                padding: 1.1rem 0 .85rem;
                color: #333;
                display: block;
                font-weight: normal;
                font-size: .6rem;
                text-align: center;
                border-top: .05rem solid #f2f2f2;
            }
        }
    }
</style>
