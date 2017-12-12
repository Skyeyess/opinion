<template>
    <div class="opinion-container">
        <div class="opinion-navbar">
            <router-link :to="{ name: 'opinion-summary' }" v-if="menuShow('opinion-summary')" v-text="$t('opinion.summary')"></router-link>
            <router-link :to="{ name: 'opinion-report' }" :class="{'redPoint': reportPoint}" v-if="menuShow('opinion-report')" v-text="$t('opinion.report')"></router-link>
            <router-link :to="{ name: 'opinion-sensitive' }" v-if="menuShow('opinion-sensitive')" v-text="$t('opinion.sensitive')"></router-link>
            <router-link :to="{ name: 'opinion-special' }" v-if="menuShow('opinion-special')" v-text="$t('opinion.special')"></router-link>
        </div>
        <div class="switch-role" @click="openPicker">- {{roleValue}}<i class="iconfont icon-arrow-down" v-if="roles[0].values.length !== 1"></i></div>
        <mt-popup v-model="rolesItem" position="bottom" class="mint-datetime">
            <mt-picker
                class="mint-datetime-picker"
                :slots="roles"
                @change="rolesChange" 
                show-toolbar>
                <span class="mint-datetime-action mint-datetime-cancel" @click="rolesItem = false" v-text="$t('common.cancel')"></span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="switchRole(),Logger('角色切换')" v-text="$t('common.ok')"></span>
            </mt-picker>
        </mt-popup>
        <keep-alive v-if="domRest">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script type="text/javascript">
    import { mapState, mapActions } from 'vuex';
    export default {
    data() {
        return {
            rolesItem: false,
            roleValue: '',
            currentSelect: '',
            domRest: true
        }
    },
    computed: {
        ...mapState({
            userMenu: state => state.login.userMenu,
            reportPoint: state => state.opinion.reportPoint,
            roles: state => state.login.roles,
            rolesId: state => state.login.rolesId
        })
    },
    mounted() {
        const self = this;
        if (self.userMenu) {
            self.getOpinionRead(self);
            let tabChild = document.querySelectorAll('.opinion-navbar a');
            for (let i = 0; i < tabChild.length; i++) {
                tabChild[i].style.width = `${100 / self.userMenu.split(',').length}%`;
            }
        }
    },
    activated () {
        const self = this;
        const titleDom = self.$('.mint-header-title');
        titleDom.addClass('text-indent3')
        self.roleValue = localStorage.currentRole;
        self.currentSelect = localStorage.currentRole;
    },
    methods: {
        ...mapActions(['getOpinionRead']),
        menuShow(text) {
            const self = this;
            if (self.userMenu) {
                return self.userMenu.includes(text);
            } else {
                return false;
            }
        },
        rolesChange(item) {
            const self = this;
            self.currentSelect = item.values[0];
        },
        openPicker() {
            const self = this;
            if (self.roles[0].values.length === 1) {
                return
            }
            self.rolesItem = true
        },
        switchRole() {
            const self = this;
            self.roleValue = self.currentSelect;
            let roleIndex = self.roles[0].values.indexOf(self.roleValue);
            localStorage.roleIndex = roleIndex;
            self.roles[0].defaultIndex = roleIndex;

            localStorage.roleId = self.rolesId[roleIndex];
            localStorage.currentRole = self.currentSelect;
            self.rolesItem = false;
            self.domRest = false;
            setTimeout(() => {
                self.domRest = true;
            }, 200);
        }
    }
}
</script>
<style lang="scss">
.opinion-container {
    height: 100%;
    padding-top: 3.2rem;
    background-color: #F4F7F9;
    font-family: 'PingFangSC-Regular', 'PingFang SC';
    position: relative;
    .redPoint:after {
        right: 6px;
        top: 50%;
        margin-top: -.125rem;
    }
    .picker-slot {
        width: 100%;
    }
    .switch-role {
        position: fixed;
        top: 1.6rem;
        left: 49%;
        font-size: .7rem;
        color: #152734;
        z-index: 10;
        .icon-arrow-down {
            font-size: 12px;
            margin-left: .3rem;
        }
    }
    .opinion-tab {
        width: 100%;
        background-color: #fff;
        .opinion-tab-left,
        .opinion-tab-right {
            float: left;
            width: 50%;
            line-height: 2.2rem;
            text-align: center;
            border-top: 1px solid #e7edf0;
            border-bottom: 1px solid #e7edf0;
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
        .opinion-tab-left:after {
            position: absolute;
            top: .7rem;
            right: 0;
            content: "";
            width: 1px;
            height: .8rem;
            border-radius: .3rem;
            background-color: #e7edf0;
        }
    }
    .charts-info {
        height: 7.3rem;
        background-color: #fff;
        padding: .7rem 1.3rem 1.1rem;
        box-sizing: border-box;
        color: #999;
        font-size: .6rem;
        border-bottom: .5px solid #e7edf0;
        .chart-time {
            color: #333;
            font-size: .7rem;
            text-align: center;
            margin-bottom: 1.5rem;
        }
        .chart-total,
        .chart-media {
            margin-top: .8rem;
            .info-count {
                float: left;
                width: 50%;
                font-size: .7rem;
                color: #c1cadc;
                span{
                    float: left;
                    width: 4.5rem;
                    line-height: 1rem;
                    &:last-child{
                        width: 3rem;
                        float: left;
                        color: #333;
                        line-height: 1rem;
                    }
                }
                i{
                    color: #4f84ef;
                    line-height: 1rem;
                    vertical-align: middle;
                }
            }
        }
    }
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
        #dailyLine{
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        #dailyBar {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            height: 15rem;
        }
        #dailyWord {
            height: 10rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        #dailyHollow {
            height: 13rem;
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
            &:first-child{
                border-top: none;
            }
        }
    }

    .date-picker {
        width: 100%;
        height: 0;
        background-color: #fff;
        overflow: hidden;
        font-size: .6rem;
        transition: all .3s ease-in-out;
        &.show {
            margin-bottom: .3rem;
            height: 5.6rem;        
        }
        &.hide {
            height: 0;
        }
        .date-picker-content {
            padding: .7rem 1.6rem 1rem 1.5rem;
            .date-picker-start,
            .date-picker-end,
            .picker-company {
                width: 50%;
                em {
                    float: left;
                    width: 1.4rem;
                    line-height: 1.3rem;
                    font-size: .7rem;
                    color: #152633;
                }
                span {
                    float: left;
                    width: 5.8rem;
                    height: 1.3rem;
                    color: #4F84EF;
                    line-height: 1.3rem;
                    text-align: center;
                    border-radius: .65rem;
                    background-color: #f4f7f8;
                    &.placeholder{
                        color: #ccc;
                    }
                }
            }
            .picker-company {
                width: 100%;
                padding-top: .6rem;
                em{
                    width: auto;
                }
                span{
                    width: 8rem;
                }
            }
        }
        .date-picker-find {
            padding: 0 1.6rem .95rem 1.5rem;
            width: 8.4rem;
            height: 1.6rem;
            margin: 0 auto;
            line-height: 1.6rem;
            color: #fff;
            text-align: center;
            border-radius: 1rem;
            background-color: #4f84ef;
            box-shadow: 0 2px 4px 0 rgba(79, 132, 239, 0.4);
            -webkit-box-shadow: 0 2px 4px 0 rgba(79, 132, 239, 0.4);
            &.left{
                background-color: #a1b4da;
                box-shadow: 0 2px 4px 0 rgba(161, 180, 218, 0.4);
                -webkit-box-shadow: 0 2px 4px 0 rgba(161, 180, 218, 0.4);
                margin-left: 2rem;
                width: 6rem;
            }
            &.right{
                margin-right: 2rem;
                width: 6rem;
            }
            &.disabled{
                background-color: #ccc;
                box-shadow: 0 2px 4px 0 rgba(175, 175, 175, 0.4);
                -webkit-box-shadow: 0 2px 4px 0 rgba(175, 175, 175, 0.4);
            }
        }
    }
    .common-filter {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        width: 2.2rem;
        height: 2.2rem;
        line-height: 2.2rem;
        text-align: center;
        box-shadow: -2px 0 7px 0 rgba(185, 197, 203, 0.32);
        -webkit-box-shadow: -2px 0 7px 0 rgba(185, 197, 203, 0.32);
        i {
            font-size: .7rem;
            color: #4f84ef;
        }
    }
    .scroll-bottom {
        height: 1.2rem;
        color: #999;
        text-align: center;
        line-height: 1.2rem;
    }
    .mint-navbar {
        margin-top: .2rem;
        .mint-tab-item {
            padding: .6rem 0;
            font-size: .7rem;
            color: #999;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            &.is-selected {
                margin-bottom: 0;
            }
            .mint-tab-item-label {
                font-size: .7rem;
            }
        }
    }
    .mint-popup-top {
        width: 100%;
        text-align: center;
        height: 1.5rem;
        font-size: .7rem;
        color: #333;
        background-color: #adf;
        line-height: 1.5rem;
        position: absolute !important;
        top: 0;
    }
    .mint-spinner-snake {
        height: 2rem;
        width: 2rem;
        text-align: center;
        display: inline-block;
        margin-top: 2rem;
    }
    .mint-datetime-cancel{
        text-align: left;
        font-size: .75rem;
        color: #152734;
        padding-left: 1.5rem;
    }
    .mint-datetime-confirm{
        text-align: right;
        font-size: .75rem;
        color: #4A84F9;
        padding-right: 1.5rem;
    }
    .picker-slot{
        font-size: .75rem;
    }
    .picker-item.picker-selected{
        color: #4A84F9;
        font-size: .8rem;
    }
}
</style>
