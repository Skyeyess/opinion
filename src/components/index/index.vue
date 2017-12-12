<template>
    <div class="index-container">
        <!-- 首页tab部分 -->
        <div class="index-tabs" @scroll="tabsScroll" ref="indexTabs">
            <div :swiper="swiperOption">
                <div class="swiper-wrapper">
                    <a class="tab-item swiper-slide" v-for="(tab, index) in tabsArr" :key="index" :class="{'active': isActive === index}" @click="clickTab(tab, index)">{{ tab }}</a>
                </div>
            </div>
        </div>
        <div class="tab-more left-side">
            <img :src="imgBase + 'jianbian.png'">
        </div>
        <div class="tab-more" @click="moreVisible = !moreVisible">
            <img :src="imgBase + 'icon_more@3x.png'">
        </div>
        <div class="mint-tab-container" id="index-main" v-rocket="{ num: scrollNum, menu: 3 }" ref="indexMain" @scroll="indexMainScroll">
            <load-more :news-data="indexData[isActive]" :ref-name="'indexMore'" @getList="getList">
                <div slot="header">
                    <div class="hotTopic-wrapper" v-if="isActive === 0">
                        <ul>
                            <li class="hotTopic-item" v-for="(item, index) in topSpot" :key="index" :class="{'is-animate': isAnimate}" :type="'hot' + index" @click="Logger('气泡'), hideTip()">
                                <router-link :to="{ name: 'hotTopicList', query: { keyword: item.topic, hottopicId: hottopicId} }">
                                    <span v-text="item.topic"></span>
                                </router-link>
                            </li>
                        </ul>
                        <div class="tooltip-top" v-if="showTooltip">
                            <span class="tooltip-text">戳不同气泡查看话题</span>
                            <img :src="imgBase + 'pop_close.png'" class="tooltip-close" @click.self="hideTip">
                        </div>
                        <div class="desc-txt">
                            <span class="line">-</span>
                            <span class="txt">{{ $t("index.topicUpdate") }}</span>
                            <span class="line">-</span>
                        </div>
                    </div>
                    <div class="hotTopic-wrapper" v-else>
                        <ul class="circle-chart">
                            <li class="hotTopic-item" v-for="(item, index) in topSpot" :key="index" :class="{'is-animate': isAnimate}" :type="item.mapType + index" @click="Logger('气泡'), hideTip()">
                                <router-link :to="{ name: 'hotTopicList', query: { keyword: item.topic, hottopicId: hottopicId} }">
                                    <span v-text="item.topic"></span>
                                </router-link>
                            </li>
                        </ul>
                        <div class="desc-txt">
                            <span class="line">-</span>
                            <span class="txt" v-text="$t('index.topicCustom', [getCurrentMap()])"></span>
                            <span class="line">-</span>
                        </div>
                    </div>
                </div>
            </load-more>
        </div>
        <mt-popup class="index-more-tabs" v-model="moreVisible" position="right">
            <!-- <h3>{{ $t("information.mychannel") }}</h3> -->
            <h6>{{ $t("information.deleteChannel") }}</h6>
            <div class="index-add-tabs">
                <span v-for="(tab, index) in tabsArr" :key="index" @click="delTabs(tab)">{{ tab }}</span>
            </div>
            <h6>{{ $t("information.addChannel") }}</h6>
            <div class="index-del-tabs">
                <span v-for="(tab, index) in noTabsArr" :key="index" @click="addTabs(tab)">{{ tab }}</span>
            </div>
            <div class="screen-btn clearfix">
                <a class="finish-btn" @click="moreVisible = false,Logger('订阅')">{{ $t("common.finish") }}</a>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            state: 'first',
            selected: '',
            imageShow: false,
            isAnimate: false,
            isActive: 0,
            moreVisible: false,
            scrollNum: 0,
            leftScroll: 0,
            showTooltip: !localStorage.indexTip,
            swiperOption: {
                loopedSlides: 1,
                slidesPerView: 'auto'
            }
        }
    },
    computed: {
        ...mapState({
            tabDefault: state => state.home.tabDefault,
            transType: state => state.home.transType,
            tabsArr: state => state.home.tabsArr,
            noTabsArr: state => state.home.noTabsArr,
            indexData: state => state.home.data,
            topSpot: state => state.home.topSpot,
            hottopicId: state => state.home.hottopicId,
            cloudWords: state => state.home.cloudWords
        })
    },
    activated() {
        const self = this;
        self.$refs.indexMain.scrollTop = self.scrollNum;
        self.$refs.indexTabs.scrollLeft = self.leftScroll;
        self.clearRefresh(self, 'indexMore');
    },
    mounted() {
        const self = this;
        self.isAnimate = true;
        self.selected = self.tabDefault;
        // self.getTopHot(self);
        // self.askNews(self);
        self.getTags(self);
    },
    watch: {
        selected(newVal, oldVal) {
            const self = this;
            if (oldVal !== newVal) {
                self.isAnimate = false;
                self.getTopHot(self);
                self.indexData[self.isActive] = [];
                const marginTop = document.querySelector('.mint-tab-container');
                marginTop.scrollTop = 0;
                self.state = 'first';
                self.askNews(self);
            }
            if (newVal) {
                self.Logger(self.selected);
            }
        },
        moreVisible(newVal) {
            const self = this;
            if (!newVal) {
                self.finishMore();
            }
        }
    },
    updated() {
        const self = this;
        sessionStorage.indexTab = self.selected;
    },
    methods: {
        ...mapActions(['getTopHot', 'askNews', 'getTags', 'addTag', 'deleteTag']),
        hideTip() {
            const self = this;
            self.showTooltip = false;
            localStorage.indexTip = true;
        },
        getCurrentMap() {
            const self = this;
            const keyArr = Object.keys(self.transType);
            const valueArr = Object.values(self.transType);
            if (self.$i18n.locale === 'en') {
                return valueArr[keyArr.indexOf(self.selected)];
            }
            return self.selected;
        },
        checkImg(imgUrl) {
            // const self = this;
            // const ImgObj = new Image();
            // ImgObj.src = imgUrl;
            // if (ImgObj.width > 0 && ImgObj.height > 0) {
            //     self.imageShow = true;
            // } else {
            //     self.imageShow = false;
            // }
        },
        getList(state) {
            const self = this;
            self.state = state;
            if (state === 'refresh') {
                self.isAnimate = false;
                self.getTopHot(self);
            }
            self.askNews(self);
        },
        indexMainScroll() {
            const self = this;
            self.scrollNum = self.$refs.indexMain.scrollTop;
        },
        clickTab(tab, index) {
            const self = this;
            self.selected = tab;
            self.isActive = index;
        },
        // 删除标签
        delTabs(tab) {
            const self = this;
            if (tab === self.tabDefault) return;
            let tabIndex = self.tabsArr.indexOf(tab);
            self.tabsArr.splice(tabIndex, 1);
            self.noTabsArr.push(tab);
        },
        // 添加标签
        addTabs(tab) {
            const self = this;
            let tabIndex = self.noTabsArr.indexOf(tab);
            self.noTabsArr.splice(tabIndex, 1);
            self.tabsArr.push(tab);
        },
        // 完成标签订阅
        finishMore() {
            const self = this;
            self.isActive = 0;
            self.selected = self.tabDefault;
            self.moreVisible = false;
            self.addTag(self);
            self.tabsArr.unshift(self.tabDefault);
            // self.deleteTag(self);
        },
        tabsScroll() {
            const self = this;
            self.leftScroll = self.$refs.indexTabs.scrollLeft;
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/common.scss';
// container
.index-container {
    .index-tabs {
        display: block;
        background-image: -webkit-linear-gradient(to right, #ffffff, #f6f6f6);
        background-image: linear-gradient(to right, #ffffff, #f6f6f6);
        background-color: #f6f6f6;
        width: -webkit-calc(100% - 2.2rem);
        width: calc(100% - 2.2rem);
        position: fixed;
        left: 0;
        right: 0;
        top: 3.2rem;
        z-index: 3;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        white-space: nowrap;
        &::-webkit-scrollbar {
            display: none;
        }
        .tab-item {
            width: 3.5rem !important;
            display: inline-block;
            vertical-align: middle;
            font-size: .7rem;
            padding: 0 1rem;
            height: 2.2rem;
            text-align: center;
            line-height: 2.2rem;
            color: #A1B4DA;
            &.active {
                font-size: 0.9rem;
                color: #4f84ef;
            }
        }
    }
    .tab-more {
        position: fixed;
        right: 0;
        top: 3.2rem;
        z-index: 5;
        height: 2.2rem;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        img {
            width: 2.2rem;
            height: 2.2rem;
        }
        &.left-side {
            right: 2.2rem;
            img {
                width: auto;
                height: 2.2rem
            }
        }
    }
    #index-main {
        position: absolute;
        background: #f4f7f9;
        top: 0;
        padding-top: 5.4rem;
        width: 100%;
        height: 100%;
        padding-bottom: 55px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        display: block;
        .hotTopic-wrapper {
            position: relative;
            height: 11rem;
            background: url(#{$imgBase}bg.png) no-repeat;
            background-size: cover;
            overflow: hidden;
            border-bottom: .5px solid #eee;
            .tooltip-top {
                position: absolute;
                bottom: 1.2rem;
                right: 1.65rem;
                width: 8.9rem;
                height: 2.25rem;
                background: url(#{$imgBase}pop_top.png) no-repeat;
                background-size: 100% 100%;
                z-index: 10;
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
                    top: 0.35rem;
                    right: 0;
                }
            }
            .circle-chart {
                display: block;
                position: relative;
            }
            .desc-txt {
                position: absolute;
                left: 0;
                bottom: 1.1rem;
                width: 100%;
                text-align: center;
                .txt {
                    color: #162734;
                }
                .line {
                    position: relative;
                    top: 0;
                    display: inline-block;
                    width: 0.5rem;
                    height: 0.01rem;
                    background-color: #162734;
                }
            }
            .hotTopic-item {
                position: absolute;
                text-align: center;
                border-radius: 50%;
                @mixin hotTopic-mixin($top, $left, $width, $img, $size, $animate) {
                    left: $left;
                    top: $top;
                    width: $width;
                    height: $width;
                    background: url(#{$imgBase}hot#{$img}.png) no-repeat;
                    background-size: cover;
                    &.is-animate {
                        animation:#{$animate} .4s;
                        -webkit-animation:#{$animate} .4s;
                        -moz-animation:#{$animate} .4s;
                        -o-animation:#{$animate} .4s;
                        -ms-animation:#{$animate} .4s;
                    }
                    span {
                        font-size: $size;
                        color: #fff;
                        line-height: $width;
                    }
                }
                &[type$="0"] {
                    @include hotTopic-mixin(2.8rem, 8rem, 4.9rem, 1, 1rem, mymove1);
                }
                &[type$="1"] {
                    @include hotTopic-mixin(1.4rem, 4.7rem, 3.8rem, 2, 0.8rem, mymove4);
                }
                &[type$="2"] {
                    @include hotTopic-mixin(5.6rem, 12.6rem, 3.1rem, 3, 0.7rem, mymove2);
                }
                &[type$="3"] {
                    @include hotTopic-mixin(5rem, 1.1rem, 2.8rem, 4, 0.8rem, mymove3);
                }
                &[type$="4"] {
                    @include hotTopic-mixin(3.5rem, 15.1rem, 2.5rem, 5, 0.7rem, mymove3);
                }
                &[type$="5"] {
                    @include hotTopic-mixin(5.8rem, 5.7rem, 2.4rem, 6, 0.6rem, mymove3);
                }
                &[type$="6"] {
                    @include hotTopic-mixin(1.5rem, 11.5rem, 2.3rem, 7, 0.6rem, mymove2);
                }
                &[type$="7"] {
                    @include hotTopic-mixin(4.5rem, 4rem, 2rem, 8, 0.7rem, mymove2);
                }
                &[type$="8"] {
                    @include hotTopic-mixin(3.6rem, 12.9rem, 1.9rem, 9, 0.6rem, mymove4);
                }
                @each $type in hot,
                finance,
                technology,
                tour,
                politics {
                    @for $i from 0 through 8 {
                        &[type=#{$type}#{$i}] {
                            background-image: url('#{$imgBase}#{$type}#{$i + 1}.png');
                        }
                    }
                }
            }
        }
    }
    .index-more-tabs.mint-popup-right {
        height: 100vh;
        width: 80%;
        top: 50%;
        text-align: left;
        background-color: #fff;
        padding-top: 1rem;
        h3 {
            font-size: .8rem;
            color: #162734;
            margin-top: 1rem;
            font-weight: 700;
            padding: .2rem 1rem;
        }
        h6 {
            font-size: .6rem;
            color: #A1B4DA;
            height: 1.5rem;
            line-height: 1.5rem;
            margin-top: 1rem;
            font-weight: normal;
            padding: 0 1rem;
            background: #F4F7F8;
        }
        .index-add-tabs {
            // padding-left: 1%;
            margin-top: 1rem;
            font-size: 0;
            >span {
                display: inline-block;
                width: 23%;
                color: #162734;
                margin-left: 7.5%;
                margin-bottom: 1rem;
                border-radius: 1rem;
                font-size: .7rem;
                text-align: center;
                background-color: #F4F7F8;
                line-height: 2em;
                &:first-child {
                    color: #fff;
                    background-color: #4e87f8;
                }
            }
        }
        .index-del-tabs {
            // padding-left: 1%;
            margin-top: 1rem;
            font-size: 0;
            >span {
                display: inline-block;
                width: 23%;
                margin-left: 7.5%;
                margin-bottom: 1rem;
                border-radius: 1rem;
                font-size: .7rem;
                text-align: center;
                background-color: #F4F7F8;
                line-height: 2em;
            }
        }
        .screen-btn {
            position: absolute;
            bottom: 0;
            width: 100%;
            .finish-btn {
                display: block;
                float: left;
                width: 100%;
                height: 2.7rem;
                line-height: 2.7rem;
                text-align: center;
                font-size: .8rem;
                color: #fff;
                background-color: #a1b4da;
                &:last-child {
                    background-color: #4e87f8;
                }
            }
        }
    }
}
</style>
