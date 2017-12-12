<template>
    <div class="order-container">
        <div class="insight-tabs" @scroll="insightTabsScroll" ref="insightTabs">
            <a class="tab-item" v-for="(tab, index) in tabsArr" :key="index" :class="{'active': isActive === index}" @touchend="tabSelect(tab, index)">{{ tab }}</a>
        </div>
        <div class="tab-more"><img :src="imgBase + 'insight_jianbian.png'"></div>
        <div class="insight-wrapper" id="insight-main" ref="insightMain" @scroll="insightMainScroll" v-rocket="{ num: scrollNum, menu: 2 }">
            <load-more :news-data="tabContent" :ref-name="'insightMore'" @getList="getList">
                <div slot="main">
                    <div class="insight-list">
                        <insight-item v-for="item in tabContent.list" :key="item.id" :insight="item"></insight-item>   
                    </div>
                </div>
            </load-more>
        </div>
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                state: 'first',
                isActive: 0,
                postTab: '',
                insightImage: `${location.origin}/`,
                scrollNum: 0,
                leftScroll: 0
            }
        },
        computed: {
            ...mapState({
                totalPage: state => state.insight.totalPage,
                tabContent: state => state.insight.tabContent,
                tabsArr: state => state.insight.tabsArr
            })
        },
        watch: {
            postTab(newVal, oldVal) {
                const self = this;
                if (newVal !== oldVal) {
                    self.state = 'first';
                    self.getInsight(self);
                }
                if (newVal) {
                    self.Logger(self.postTab);
                }
            }
        },
        mounted() {
            const self = this;
            self.getInsTags(self);
        },
        activated() {
            const self = this;
            self.$refs.insightMain.scrollTop = self.scrollNum;
            self.$refs.insightTabs.scrollLeft = self.leftScroll;
            self.getEleHeight('.insight-list');
        },
        methods: {
            ...mapActions(['getInsight', 'getInsTags']),
            getList(state) {
                const self = this;
                self.state = state;
                self.getInsight(self);
            },
            tabSelect(tab, index) {
                const self = this;
                self.postTab = tab;
                self.isActive = index;
                self.state = 'first';
            },
            insightMainScroll() {
                const self = this;
                self.scrollNum = self.$refs.insightMain.scrollTop;
            },
            insightTabsScroll() {
                const self = this;
                self.leftScroll = self.$refs.insightTabs.scrollLeft;
            }
        }
    }
</script>
<style lang="scss">
    .order-container{
        position: absolute;
        top: 3.2rem;
        height: -webkit-calc(100% - 3.2rem - 55px);
        height: -moz-calc(100% - 3.2rem - 55px);
        height: calc(100% - 3.2rem - 55px);
        width:100%;
        background: #f4f7f9;
        .mint-loadmore-top{
            background-size: 100% 100%;
            .mint-loadmore-spinner{
                display: none !important;
            }
        }
        .insight-tabs {
            background-image: -webkit-linear-gradient(to right, #ffffff, #f6f6f6);
            background-image: linear-gradient(to right, #ffffff, #f6f6f6);
            background-color: #f6f6f6;
            width: 100%;
            position: fixed;
            top: 3.2rem;
            font-size: 0;
            z-index: 1;
            padding-right: 1.5rem;
            white-space: nowrap;
            overflow-x: auto;
            overflow-y: hidden; 
            -webkit-overflow-scrolling: touch;
            &::-webkit-scrollbar{
                display: none;
            }
            .tab-item {
                display: inline-block;
                vertical-align: middle;
                font-size: .7rem;
                padding: 0 0.5rem;
                height: 2.2rem;
                line-height: 2.2rem;
                text-align: center;
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
            width: 2.2rem;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            img {
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
        .insight-wrapper{
            height: 100%;
            position: absolute;
            width: 100%;
            padding-top: 2.2rem;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            .insight-item{
                position:relative;
                width:100%;
                border-bottom: 1px solid #eee;
                background: #fff;
                > a {
                    padding: .5rem;
                    overflow: hidden;
                    position: relative;
                    font-size: 0;
                    .insight-img {
                        display: inline-block;
                        vertical-align: middle;
                        position: relative;
                        width: 4.6rem;
                        height: 3.5rem;
                        img {
                            width: 4.6rem;
                            height: 3.5rem;            
                        }
                        img[lazy='error'] {
                            display: none;
                        }
                        img[lazy='loading'] {
                            width: 2rem;
                            height: auto;
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            -webkit-transform: translate(-50%, -50%);
                            transform: translate(-50%, -50%);
                        }
                        img[lazy='loading'] + .pdf-shade{
                            display: none;
                        }
                        img[lazy='loading'] + .pdf-shade + .pdf-icon{
                            display: none;
                        }
                        .pdf-shade {
                            display: block;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.1);
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index: 1;
                        }
                        .pdf-icon {
                            position: absolute;
                            z-index: 2;
                            width: 1.9rem;
                            height: auto;
                            left: 50%;
                            top: 50%;
                            -webkit-transform: translate(-50%, -50%);
                            transform: translate(-50%, -50%);
                        }
                    }
                }
                .content{
                    display: inline-block;
                    margin-left: .8rem;
                    height: 3.5rem;
                    width: calc(100% - 4.6rem - 0.8rem);
                    color:#d5d3d3;
                    vertical-align: middle;
                    position: relative;
                    .tit{
                        font-size:0.75rem;
                        color: #162734;
                        font-weight: normal;
                    }
                    .extral{
                        width: 100%;
                        position: absolute;
                        bottom: 0;
                        display: -webkit-box;
                        display: -webkit-flex;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-justify-content: -webkit-space-between;
                        justify-content: space-between;
                        -webkit-align-items: center;
                        align-items: center;
                        span{
                            font-size: 0.6rem;
                            color: #C1CADC;
                            display: -webkit-box;
                            display: -webkit-flex;
                            display: -ms-flexbox;
                            display: flex;
                            -webkit-align-items: center;
                            align-items: center;
                            i {
                                margin-right: .25rem;
                                font-size: .8rem;
                                vertical-align: text-bottom;
                                &.icon-time {
                                    font-size: .85rem;
                                }
                                &.icon-link {
                                    font-size: .7rem;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .page-part{
        z-index: 99;
    }
    .order-list{
        position: relative;
        height: calc(100% - 55px);
        overflow: scroll;
    }
    .order-item img{
        width: 100px;
        height: 100px;
        float: left;
    }
    .order-item h4{
        padding-top: 20px;
        margin-left: 110px;
    }
    .order-item{
        height: 100px;
        position: relative;
        top: 5px;
    }
    .order-item p{
        position: absolute;
        bottom: 10%;
        color: #c1c1c1;
        left: 110px;
    }
    .mint-navbar.is-fixed{
        top: 40px;
        position: static !important;
    }
    .mint-navbar .mint-tab-item.is-selected{
        margin-bottom: 0;
    }
</style>
