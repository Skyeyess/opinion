<template>
    <div class="app-container">
        <!-- header部分 -->
        <mt-header fixed :title="selected" class="header" v-show="$route.name !== 'share' && $route.name !== 'maintain'">
            <div slot="left">
                <div class="back-prev">
                    <i v-if="backShow(true)" class="mintui mintui-back" @click="backPrev"></i>
                    <i v-if="!backShow()" class="iconfont icon-user" :class="{'redPoint': !!msgCount}" @click="toProfile"></i>
                </div>
            </div>
            <mt-button slot="right">
                <router-link :to="{name: 'search', query: {routeType: $route.name}}">
                    <i class="iconfont icon-search" v-if="!backShow() && $route.name !== 'insight'"></i>
                </router-link>
            </mt-button>
        </mt-header>
        <!-- 底部菜单栏部分 -->
        <mt-tabbar v-model="selectedTab" class="bottom_tabs" fixed v-if="!backShow()">
            <mt-tab-item v-for="nav in navList" :key="nav.id" :id="nav.id" :class="{'redPoint': reportPoint && nav.redPoint}">
                <img slot="icon" v-if="selectedTab === nav.id" :src="nav.selectedImg" :alt="nav.alt">
                <img slot="icon" v-else :src="nav.selectImg" :alt="nav.alt">
                <router-link :to="{ name: nav.route }"></router-link>
                <span class="block" v-text="$t(nav.name)"></span>
                <i class="back-top iconfont icon-rocket" @click="backTop"></i>
            </mt-tab-item>
        </mt-tabbar>
        <!-- 内容部分 -->
        <keep-alive v-if="changeI18n">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script type="text/javascript">
import { mapState, mapActions } from 'vuex'

export default {
    data() {
        return {
            selected: '',
            selectedTab: 'index',
            backVisible: false,
            changeI18n: true,
            routerHistory: [],
            routerProfile: ['setting', 'message', 'myComment', 'collection', 'about', 'switches', 'profile']
        }
    },
    computed: {
        ...mapState({
            navList: state => state.app.navList,
            backList: state => state.app.backList,
            scrollEle: state => state.app.scrollEle,
            detailTitle: state => state.detail.detailTitle,
            msgCount: state => state.message.count,
            reportPoint: state => state.opinion.reportPoint,
            token: state => state.login.token
        })
    },
    watch: {
        // 当其他页面route.pash的时候，index路由也能在header正确显示首页
        '$route'(item) {
            const self = this;
            // 人工造历史组
            if (self.routerHistory[self.routerHistory.length - 1] !== item.name) {
                self.routerHistory.push(item.name);
            }
            const titleDom = self.$('.mint-header-title');
            if (!item.name.includes('opinion')) {
                titleDom.removeClass('text-indent3')
            }
            if (item.meta.routeTitle) {
                self.selected = self.$t(item.meta.routeTitle);
            }
            if (item.meta.selectedTab) {
                self.selectedTab = item.meta.selectedTab;
            }
            if (item.meta.pageKey) {
                self.Logger(item.meta.pageKey);
            }
            if ('rocketIndex' in item.meta) {
                self.rocketHide(item.meta.rocketIndex);
            }
        }
    },
    mounted() {
        const self = this;
        self.sendClient({ body: true, type: 'loading' });
        self.routerHistory.push(self.$route.name);
        self.getOpinionRead(self);
        self.getNoReads(self);
        if (localStorage.userName && localStorage.log) {
            self.sendLog();
        }
        window.addEventListener('storageEvent', function(e) {
			if (e.storageKey === 'userLog') {
				localStorage.removeItem('userLog');
                if (localStorage.userName && localStorage.log) {
                    self.sendLog();
                }
			}
		});
    },
    updated() {
        const self = this;
        const item = self.$route;
        if (item.meta.routeTitle) {
            self.selected = self.$t(item.meta.routeTitle);
        }
        if (item.meta.selectedTab) {
            self.selectedTab = item.meta.selectedTab;
        }
        if ('rocketIndex' in item.meta) {
            self.rocketHide(item.meta.rocketIndex);
        }
    },
    methods: {
        ...mapActions(['getOpinionRead', 'getNoReads', 'sendLog']),
        rocketHide(index) {
            const self = this;
            self.$nextTick(() => {
                for (let i = 0; i < 4; i++) {
                    const backIcon = document.querySelectorAll('.back-top')[i];
                    const bottomNav = document.querySelectorAll('.bottom_tabs .mint-tab-item .mint-tab-item-icon')[i];
                    if (i !== index) {
                        bottomNav.style.marginTop = 0;
                        backIcon.style.top = 56 + 'px';
                    } else {
                        self.scrollEle[index].forEach(item => {
                            let scrollMain = document.getElementById(item);
                            if (scrollMain) {
                                if (scrollMain.scrollTop > self.rocketShow) {
                                    bottomNav.style.marginTop = -60 + 'px';
                                    backIcon.style.top = 35 + 'px';
                                } else {
                                    bottomNav.style.marginTop = 0;
                                    backIcon.style.top = 56 + 'px';
                                }
                            }
                        });
                    }
                }
            })
        },
        backTop() {
            const self = this;
            self.scrollEle.forEach(childEld => {
                childEld.forEach(item => {
                    let scrollMain = document.getElementById(item);
                    if (scrollMain) {
                        clearInterval(timer);
                        const timer = setInterval(() => {
                            if (scrollMain.scrollTop === 0) {
                                clearInterval(timer);
                            } else {
                                scrollMain.scrollTop -= scrollMain.scrollTop / 5;
                            }
                        }, 10);
                    }
                });
            });
        },
        toProfile() {
            const self = this;
            self.$router.push({ name: 'profile' });
        },
        backPrev() {
            const self = this;
            if (self.routerHistory.length > 1) {
                if (self.routerProfile.includes(self.$route.name)) {
                    self.$router.replace({ name: self.routerHistory[self.routerHistory.length - 2] });
                } else {
                    self.$router.go(-1);
                }
                self.routerHistory.pop();
            } else {
                self.$router.push({ name: 'index' });
            }
        },
        backShow(state) {
            const self = this;
            if (state && localStorage.loginType && localStorage.loginType === 'bim') {
                if (self.$route.name === 'login') {
                    return false;
                }
            }
            if (self.backList) {
                if (self.backList.includes(self.$route.name)) {
                    return true;
                }
            }
            return false;
        }
    }
}
</script>
<style lang="scss">
@import './assets/common.scss';


/* css reset */

* {
    margin: 0;
    padding: 0;
    list-style: none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

html {
    overflow: hidden;
}

html,
body {
    height: 100%;
    font-family: 'microsoft yahei';
}

body {
    font-size: .6rem;
}

body,
button,
input,
select,
textarea {
    font: 12px/1.5 'microsoft yahei', 'PingFangSC-Regular', 'PingFang SC';
    outline: none;
}

a {
    text-decoration: none;
    color: #000000;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    display: block;
}

em {
    font-style: normal;
}

img {
    border: 0;
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
}

.popup-modal, .common-modal {
    z-index: 99999999;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    .popup-container{
        width: 12.6rem;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -6.3rem;
        margin-top: -1rem;
        .popup-close {
            position: absolute;
            top: 0.4rem;
            right: 0.4rem;
            width: 1.2rem;
            height: 1.2rem;
        }
        .popup-header {
            height: 2rem;
            line-height: 2rem;
            color: #3b6eff;
            font-size: 0.8rem;
            text-align: center;
            background-color: #f1f5f8;
            border-radius: 0.3rem 0.3rem 0 0;
        }
        .popup-content {
            min-height: 2rem;
            max-height: 8rem;
            background-color: #fff;
            border-radius: 0 0 0.3rem 0.3rem;
            padding: 0.3rem;
            text-align: center;
            font-size: 0.75rem;
            line-height: 1.25rem;
            color: #152734;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }
    }
}

/* display */

@each $type in block,
inline-block {
    .#{$type} {
        display: #{$type};
    }
}


/* float */

.clearfix:after {
    content: "";
    height: 0;
    display: block;
    clear: both;
}

@each $direction in left,
right {
    .#{$direction},
    .pull-#{$direction} {
        float: #{$direction};
    }
}


/* text-align */

@each $direction in left,
center,
right {
    .text-#{$direction} {
        text-align: #{$direction};
    }
}


/* custom-animate */

.animated {
    animation-duration: 0.7s;
}

@mixin mymove-mixin ($index, $half, $more, $scale) {
    @keyframes mymove#{$index} {
        0% {
            transform: scale(0, 0);
            opacity: 0;
        }
        #{$half} {
            transform: scale($scale, $scale);
            opacity: 0.2;
        }
        #{$more} {
            transform: scale(0.8, 0.8);
            opacity: 0.5;
        }
        100% {
            transform: scale(1, 1);
            opacity: 1;
        }
    }
}

@include mymove-mixin(1, 40%, 70%, 1.3);
@include mymove-mixin(2, 50%, 80%, 1.2);
@include mymove-mixin(3, 60%, 80%, 1.2);
@include mymove-mixin(4, 70%, 85%, 1.2);


/* custom-style */

.text-indent3 {
    text-indent: -3em;
}

.mint-toast {
    padding: 0.6rem!important;
    max-width: 100%!important;
    min-width: 8rem!important;
}

.mint-toast-icon {
    line-height: 2rem!important;
    font-size: 1.8rem!important;
}

.mint-toast-text {
    font-size: .8rem!important;
    padding-top: 0 !important;
}
.mint-msgbox-title {
    font-size: 0.8rem!important;
}
.mint-msgbox-message {
    font-size: 0.8rem!important;
    color: #A1B4DA!important;
}
.mint-msgbox-confirm{
    font-size: 0.8rem!important;
}
.mint-msgbox-cancel{
    font-size: 0.8rem!important;
    color: #C1CADC!important;
}

// 点赞动画
@keyframes laudAnimate {
    0% {
        transform: rotate(0) translate(0, 0) scale(1);
    }
    25% {
        transform: rotate(-20deg) translate(0, -0.9rem) scale(1.1);
    }
    75% {
        transform: rotate(20deg) translate(0, -1.2rem) scale(1.2);
    }
    100% {
        transform: rotate(0deg) translate(0, 0) scale(1);
    }
}

@-webkit-keyframes laudAnimate {
    0% {
        transform: rotate(0) translate(0, 0) scale(1);
    }
    25% {
        transform: rotate(-20deg) translate(0, -0.9rem) scale(1.1);
    }
    75% {
        transform: rotate(20deg) translate(0, -1.2rem) scale(1.2);
    }
    100% {
        transform: rotate(0deg) translate(0, 0) scale(1);
    }
}

.land-animated {
    animation: laudAnimate ease 0.8s;
    /* Safari 与 Chrome: */
    -webkit-animation: laudAnimate ease 0.8s;
}
.redPoint:after {
    content: "";
    position: absolute;
    width: .25rem;
    height: .25rem;
    background: #fa3f3f;
    border-radius: 50%;
    right: 1.4rem;
    top: 7px;
}
.app-container {
    height: 100%;
    .header.mint-header {
        background-color: #fff;
        color: #152734;
        height: 2.2rem;
        padding-top: 1rem;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        .mint-header-button {
            .back-prev {
                position: relative;
                > .iconfont {
                    padding: 0.8rem 0.8rem 0.8rem 0;
                }
                .icon-user {
                    font-size: 18px;
                    color: #152734;
                    margin-left: 0.5rem;
                    &.redPoint:after {
                        right: auto;
                        left: calc(18px + 0.5rem);
                        top: 0;
                    }
                }
                .mintui-back {
                    font-size: 1rem;
                    color: #152734;
                    margin-left: 0.5rem;
                }
            }
            .mint-button {
                overflow: visible;
                .mint-button-text {
                    @mixin header-icon-mixin($size, $left) {
                        font-size: $size;
                        color: #152734;
                        margin-left: $left;
                    }
                    >a {
                        display: inline-block;
                    }
                    .mintui-back {
                        @include header-icon-mixin(1rem, 0.5rem);
                    }
                    .icon-user {
                        @include header-icon-mixin(18px, 0.5rem);
                        &.redPoint:after {
                            right: -5px;
                        }
                    }
                    .icon-search {
                        @include header-icon-mixin(18px, 0.3rem);
                    }
                }
            }
        }
        .mint-header-title {
            font-size: 1rem;
            color: #152734;
            padding-top: 0.6rem;
            line-height: 1rem;
            height: 2.2rem;
        }
    }
    .bottom_tabs.mint-tabbar {
        .mint-tab-item {
            position: relative;
            overflow: hidden;
            padding: 7px 0 6px;
            &.is-selected {
                background-color: transparent;
                color: #4A84F9;
                .mint-tab-item-label {
                    color: #4A84F9;
                }
            }
            .mint-tab-item-icon {
                width: 30px;
                height: 30px;
                margin-bottom: 0;
                transition: all .3s;
                &:empty {
                    display: block;
                }
            }
            .mint-tab-item-label {
                -webkit-transform: scale(0.9);
                transform: scale(0.9);
                color: #A6B1C8;
                >a {
                    display: block;
                    width: 100%;
                    height: 55px;
                    position: absolute;
                    bottom: 0;
                    font-size: 0.5rem;
                }
                .back-top {
                    position: absolute;
                    transition: all .3s;
                    color: #4f84ef;
                    font-size: 2.5rem;
                    top: 56px;
                    left: 50%;
                    -webkit-transform: translateX(-50%);
                    transform: translateX(-50%);
                }
            }
        }
    }
    >.mint-popup {
        background: none;
    }
    .collect-tips {
        min-width: 5.5rem;
        background: rgba(0, 0, 0, 0.7);
        font-size: .8rem;
        border-radius: .5rem;
        color: #fff;
        text-align: center;
        padding: .6rem;
        .icon-roundcheck {
            font-size: 1.8rem;
        }
        .icon-roundclose {
            font-size: 1.8rem;
        }
    }
    .news-list {
        @at-root .common-none {
            display: block;
            height: 6rem;
            line-height: 6rem;
            font-size: .7rem;
            color: #333;
            background-color: #fff;
            text-align: center;
            border-bottom: 1px solid #eee;
            .mint-spinner-snake {
                height: 1.4rem !important;
                width: 1.4rem !important;
                text-align: center;
                display: inline-block;
                margin-top: 2.3rem;
            }
        }
        .news-item {
            >a {
                padding: 0 .75rem 0 .9rem;
            }
            position: relative;
            font-size: .6rem;
            box-sizing: border-box;
            background-color: #fff;
            border-bottom: 1px solid #eee;
            &:last-child {
                margin-bottom: .25rem;
            }
            .ni-title {
                width: 100%;
                color: #162734;
                font-size: .75rem;
                min-height: 2.1rem;
                line-height: 1.05rem;
                word-break: break-all;
                overflow: hidden;
                &.readed {
                    color: #999;
                }
                b {
                    color: #4A84F9;
                }
                &.ni-label-none {
                    padding-top: .25rem;
                }
                &.ni-title-top {
                    padding-top: .65rem;
                }
            }
            .ni-info {
                box-sizing: border-box;
                position: relative;
                width: 100%;
                padding: 0.2rem 0 0.3rem;
                color: #c1cadc;
                line-height: normal;
                .ni-time {
                    display: inline-block;
                    min-width: 2.3rem;
                    &.is-count {
                        margin-right: 1rem;
                    }
                }
                .ni-source {
                    display: inline-block;
                }
                .ni-count {
                    display: inline-block;
                    min-width: 3rem;
                    text-align: center;
                    margin-right: 0.3rem;
                }
            }
            .ni-label {
                padding-top: .4rem;
                margin-left: -0.4rem;
                &.no-readed {
                    &:before {
                        content: ' ';
                        display: inline-block;
                        padding: 0.2rem;
                        border-radius: 50%;
                        background-color: #EA4E4E;
                        position: relative;
                        top: 0.9rem;
                        right: 0.2rem;
                    }
                }
            }
            .ni-btn {
                display: inline-block;
                font-size: .5rem;
                line-height: normal;
                padding: .075rem .2rem;
                margin-left: 1rem;
                box-sizing: border-box;
                margin-top: -.2rem;
                &.blue {
                    position: absolute;
                    right: 0;
                    top: 0.4rem;
                    color: #fff;
                    padding: 0 .3rem;
                    background-color: #68D2F9;
                    border-radius: .1rem;
                }
                @each $color in orange,
                gold,
                red {
                    &.#{$color} {
                        text-align: center;
                        margin-left: 0;
                        color: #fff;
                        background: url(#{$imgBase}label-#{$color}.png) no-repeat;
                        background-size: 100% 100%;
                        height: 1rem;
                        line-height: normal;
                        padding-top: .07rem;
                        width: 2.6rem;
                    }
                }
            }
        }
        @at-root .scroll-bottom {
            height: 1.2rem;
            color: #999;
            text-align: center;
            line-height: 1.2rem;
        }
    }
    .opinion-navbar {
        position: fixed;
        width: 100%;
        height: 2.4rem;
        line-height: 2.4rem;
        text-align: center;
        background-color: #fff;
        border: none;
        z-index: 10!important;
        a {
            float: left;
            width: 25%;
            font-size: .7rem;
            color: #A1B4DA;
            position: relative;
            &:before {
                content: "";
                position: absolute;
                bottom: .4rem;
                left: 50%;
                width: 0;
                height: .1rem;
                margin-left: 0;
                // background-color: #4A84F9;
            }
            &.router-link-active {
                color: #4A84F9;
                font-size: .9rem;
                transition: all .3s ease-in-out;
            }
            &.router-link-active:before {
                width: 1rem;
                margin-left: -.5rem;
                transition: all .3s ease-in-out;
            }
        }
    }
    .chart-tooltip {
        display: block;
        color: #fff;
        .chart-tooltip-point {
            display: inline-block;
            margin-right: 5px;
            border-radius: 10px;
            width: 9px;
            height: 9px;
            background-color: #4e87f9;
        }
    }
    .goTop {
        position: fixed;
        bottom: 60px;
        right: 0.5rem;
        border-radius: 50%;
        z-index: 98;
        color: #4f84ef;
        font-size: 2.5rem;
        &.bottom-10 {
            bottom: 60px;
        }
    }
    @mixin picker-items-mixin($top, $bottom, $op1, $op2) {
        content: "";
        display: block;
        width: 100%;
        height: 25%;
        position: absolute;
        z-index: 3;
        top: $top;
        bottom: $bottom;
        left: 0;
        right: 0;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, $op1) 0%, rgba(255, 255, 255, $op2) 100%);
    }
    .picker-items:before {
        @include picker-items-mixin(0, auto, 1, 0.4);
    }
    .picker-items:after {
        @include picker-items-mixin(auto, 0, 0.4, 1);
    }
    .index-container {
        padding: 3.2rem 0 55px;
        height: 100%;
        width: 100%;
        background: #f4f7f9;
        .detail-none {
            text-align: center;
            font-size: 1rem;
            color: #999;
            padding-top: 50%;
        }
        .detail-interval {
            width: 100%;
            height: 0.3rem;
            background: #f4f7f9;
            margin-bottom: 0.6rem;
        }
        @at-root .detail-content {
            width: 100%;
            height: 100%;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            background-color: #fff;
            img {
                display: block;
                margin: 0 auto;
            }
            #dailyHollow{
                padding-bottom: 0!important;
            }
            .daily-chart-info {
                text-align: center;
                font-size: 0.5rem;
                color: #152734;
                margin-bottom: 1rem;
            }
            .detail-title {
                font-size: 1rem;
                color: #152734;
                padding: 0 1rem;
            }
            .detail-info {
                margin-top: 0.5rem;
                padding: 0 1rem;
                .pull-left {
                    color: #a1b4da;
                    font-size: 0.6rem;
                }
                font-size: 0.6rem;
                color: #a1b4da;
                .detail-ml {
                    margin-left: 1rem;
                }
            }
            .about-info {
                .info-header {
                    height: 2.6rem;
                    background-color: #F4F7F9;
                    .info-text {
                        display: inline-block;
                        width: 27.7%;
                        height: 1.8rem;
                        font-size: .8rem;
                        color: #fff;
                        background-color: #4E87F9;
                        border-radius: 0 0 1rem 0;
                        font-weight: bold;
                        line-height: 1.8rem;
                        text-align: center;
                    }
                }
                .info-charts {
                    .chart-title {
                        padding: 1.55rem 0 1rem;
                        color: #333;
                        display: block;
                        font-weight: 400;
                        font-size: .7rem;
                        text-align: center;
                        border-top: 1px solid #f2f2f2;
                    }
                    .daily-chart {
                        width: 100%;
                        height: 12rem;
                        padding: 0 1.5rem 1.5rem;
                        background-color: #fff!important;
                    }
                }
            }
            .detail-main {
                padding: 0.5rem 1rem;
                font-size: 0.8rem;
                line-height: 1.3rem;
                color: #152734;
                line-height: 1.5rem;
                p,
                div {
                    width: 100%;
                    margin-bottom: 1rem;
                    text-indent: 2em;
                    word-break: break-word;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    img {
                        margin-bottom: 1rem;
                    }
                }
                div {
                    text-indent: 0;
                }
                .original-link {
                    display: inline-block;
                    margin: 0;
                    padding: 0;
                    color: #4f84ef;
                    line-height: 1.3rem;
                }
                .disclaimer {
                    font-size: .6rem;
                    line-height: 1.3rem;
                    margin-top: 10px;
                    text-indent: 0;
                    color: #8c9bb8;
                }
            }
            .collection {
                text-align: center;
                padding-bottom: 1.25rem;
                margin-top: 1rem;
                .collect-btn {
                    display: inline-block;
                    width: 5.5rem;
                    height: 1.6rem;
                    line-height: 1.6rem;
                    background: #4F84EF;
                    box-shadow: 0 2px 4px 0 rgba(79, 132, 239, 0.40);
                    border-radius: 1rem;
                    color: #fff;
                    font-size: .75rem;
                    .iconfont {
                        vertical-align: sub;
                        margin-right: .2rem;
                        font-size: 1.2rem;
                    }
                    &.collect-btn-fill {
                        background: #eee;
                        color: #152734;
                        box-shadow: 0 2px 4px 0 rgba(238, 238, 238, 0.40);
                        .iconfont {
                            color: #4F84EF;
                        }
                    }
                }
            }
        }
    }
}

.mint-msgbox-wrapper {
    .mint-msgbox {
        .mint-msgbox-btns {
            .mint-msgbox-confirm {
                color: #4E87F9;
                &.del {
                    color: #E64D4D;
                }
            }
        }
    }
}
</style>
