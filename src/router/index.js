import Vue from 'vue';
// import VueRouter from 'vue-router';
import store from '../store';
import i18n from '../language';
import api from '../constants/api.js';
import constants from '../constants/content';
import Notice from '../common/notice.js';
import countlyTrackAll from '../common/countlyTrackAll.js';
import { MessageBox } from 'mint-ui';

import index from '../components/index/index';
import hna from '../components/hna/hna';

// hna
const hnaNewsList = resolve => require(['../components/hna/hnaNewsList'], resolve)
// opinion
const opinion = resolve => require(['../components/opinion/opinion'], resolve)
const opinionReport = resolve => require(['../components/opinion/report'], resolve)
const opinionSummary = resolve => require(['../components/opinion/summary'], resolve)
const opinionSensitive = resolve => require(['../components/opinion/sensitive'], resolve)
const opinionSpecial = resolve => require(['../components/opinion/special'], resolve)
const addKeywords = resolve => require(['../components/opinion/addKeywords'], resolve)
const madeKeywords = resolve => require(['../components/opinion/madeKeywords'], resolve)
const chartDetail = resolve => require(['../components/opinion/chartDetail'], resolve)
const wordDetail = resolve => require(['../components/opinion/wordDetail'], resolve)
// insight
const insight = resolve => require(['../components/insight/insight'], resolve)
const insightDetails = resolve => require(['../components/insight/insightDetails'], resolve)
// index
const hotTopicList = resolve => require(['../components/index/hotTopicList'], resolve)
// public
const login = resolve => require(['../components/public/login'], resolve)
const maintain = resolve => require(['../components/public/maintain'], resolve)
const search = resolve => require(['../components/public/search'], resolve)
const detail = resolve => require(['../components/public/detail'], resolve)
const recommend = resolve => require(['../components/public/recommend'], resolve)
const share = resolve => require(['../components/public/share'], resolve)
const comment = resolve => require(['../components/public/comment'], resolve)
const commentDetail = resolve => require(['../components/public/commentDetail'], resolve)
// personal
const setting = resolve => require(['../components/personal/setting'], resolve)
const profile = resolve => require(['../components/personal/profile'], resolve)
const about = resolve => require(['../components/personal/about'], resolve)
const message = resolve => require(['../components/personal/message'], resolve)
const switches = resolve => require(['../components/personal/switch'], resolve)
const collection = resolve => require(['../components/personal/collection'], resolve)
const myComment = resolve => require(['../components/personal/myComment'], resolve)
const language = resolve => require(['../components/personal/language'], resolve)

// 注册路由插件setting
Vue.use(VueRouter);

const routes = [
    {
        name: 'hna',
        path: '/hna',
        component: hna,
        meta: {
            rocketIndex: 0,
            selectedTab: 'hna',
            routeTitle: 'common.hna',
            pageTitle: '海航',
            requireAuth: true
        }
    },
    {
        name: 'hnaNewsList',
        path: '/hnaNewsList',
        component: hnaNewsList,
        meta: {
            // routeTitle: 'common.hna',
            pageTitle: '海航详情'
        }
    },
    {
        name: 'opinion',
        path: '/opinion',
        meta: {
            rocketIndex: 1,
            selectedTab: 'opinion',
            routeTitle: 'common.opinion',
            pageTitle: '舆情',
            requireAuth: true
        },
        component: opinion,
        children: [{
            name: 'opinion-summary',
            path: 'summary',
            component: opinionSummary,
            meta: {
                rocketIndex: 1,
                selectedTab: 'opinion',
                routeTitle: 'common.opinion',
                pageKey: '2-2',
                pageTitle: '舆情速览'
            }
        },
        {
            name: 'opinion-report',
            path: 'report',
            component: opinionReport,
            meta: {
                rocketIndex: 1,
                selectedTab: 'opinion',
                routeTitle: 'common.opinion',
                pageKey: '2-8',
                pageTitle: '舆情报告'
            }
        },
        {
            name: 'opinion-sensitive',
            path: 'sensitive',
            component: opinionSensitive,
            meta: {
                rocketIndex: 1,
                selectedTab: 'opinion',
                routeTitle: 'common.opinion',
                pageKey: '2-24',
                pageTitle: '敏感舆情'
            }
        },
        {
            name: 'opinion-special',
            path: 'special',
            component: opinionSpecial,
            meta: {
                rocketIndex: 1,
                selectedTab: 'opinion',
                routeTitle: 'common.opinion',
                pageTitle: '专项定制'
            }
        }]
    },
    {
        name: 'chartDetail',
        path: '/chartDetail',
        component: chartDetail,
        meta: {
            routeTitle: 'common.opinion',
            pageTitle: '图表新闻'
        }
    },
    {
        name: 'wordDetail',
        path: '/wordDetail',
        component: wordDetail,
        meta: {
            routeTitle: 'common.opinion',
            pageKey: '2-22',
            pageTitle: '词云分析'
        }
    },
    {
        name: 'addKeywords',
        path: '/addKeywords',
        component: addKeywords,
        meta: {
            routeTitle: 'common.topic',
            pageTitle: '添加关键词'
        }
    },
    {
        name: 'madeKeywords',
        path: '/madeKeywords',
        component: madeKeywords,
        meta: {
            routeTitle: 'common.topic',
            pageTitle: '关键词列表'
        }
    },
    {
        name: 'insight',
        path: '/insight',
        component: insight,
        meta: {
            rocketIndex: 2,
            selectedTab: 'insight',
            routeTitle: 'common.insight',
            pageTitle: '洞见',
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    {
        name: 'insightDetails',
        path: '/insightDetails',
        component: insightDetails,
        meta: {
            routeTitle: 'common.insight',
            pageTitle: '洞见详情'
        }
    },
    {
        name: 'index',
        path: '/index',
        component: index,
        meta: {
            rocketIndex: 3,
            selectedTab: 'index',
            routeTitle: 'common.index',
            pageTitle: '资讯' // 路由标题
        }
    },
    {
        name: 'hotTopicList',
        path: '/hotTopicList',
        component: hotTopicList,
        meta: {
            routeTitle: 'common.index',
            pageTitle: '热点话题'
        }
    },
    {
        name: 'profile',
        path: '/profile',
        component: profile,
        meta: {
            routeTitle: 'common.personal',
            pageTitle: '个人中心',
            requireAuth: true
        }
    },
    {
        name: 'setting',
        path: '/setting',
        component: setting,
        meta: {
            routeTitle: 'common.userInfo',
            pageTitle: '个人信息'
        }
    },
    {
        name: 'message',
        path: '/message',
        component: message,
        meta: {
            routeTitle: 'common.messageList',
            pageKey: '5-2',
            pageTitle: '舆情通知',
            requireAuth: true
        }
    },
    {
        name: 'myComment',
        path: '/myComment',
        component: myComment,
        meta: {
            routeTitle: 'common.myComment',
            pageKey: '5-6',
            pageTitle: '我的评论'
        }
    },
    {
        name: 'collection',
        path: '/collection',
        component: collection,
        meta: {
            routeTitle: 'common.collectionList',
            pageKey: '5-7',
            pageTitle: '我的收藏'
        }
    },
    {
        name: 'about',
        path: '/about',
        component: about,
        meta: {
            routeTitle: 'common.about',
            pageTitle: '关于我们'
        }
    },
    {
        name: 'language',
        path: '/language',
        component: language,
        meta: {
            routeTitle: 'common.language',
            pageTitle: '语言切换'
        }
    },
    {
        name: 'switches',
        path: '/switches',
        component: switches,
        meta: {
            routeTitle: 'common.pushSetting',
            pageKey: '5-8',
            pageTitle: '推送设置'
        }
    },
    {
        name: 'login',
        path: '/login',
        component: login,
        meta: {
            routeTitle: 'common.login',
            pageKey: '0-0',
            pageTitle: '登录'
        }
    },
    {
        name: 'maintain',
        path: '/maintain',
        component: maintain
    },
    {
        name: 'search',
        path: '/search',
        component: search,
        meta: {
            routeTitle: 'common.search',
            pageTitle: '搜索'
        }
    },
    {
        name: 'share',
        path: '/share',
        component: share,
        meta: {
            pageTitle: '分享'
        }
    },
    {
        name: 'detail',
        path: '/detail',
        component: detail,
        meta: {
            pageTitle: '新闻详情'
        }
    },
    {
        name: 'recommend',
        path: '/recommend',
        component: recommend,
        meta: {
            pageTitle: '新闻详情'
        }
    },
    {
        name: 'comment',
        path: '/comment',
        component: comment,
        meta: {
            routeTitle: 'common.comment',
            pageTitle: '评论',
            requireAuth: true
        }
    },
    {
        name: 'commentDetail',
        path: '/commentDetail',
        component: commentDetail,
        meta: {
            routeTitle: 'common.commentDetail',
            pageTitle: '评论详情'
        }
    },
    {
        path: '*',
        redirect: to => {
            if (localStorage.token) {
                return '/hna'
            } else {
                return '/index'
            }
        }
    }
];

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
});

router.beforeEach((to, from, next) => {
    // 路由切换时候调用countly追踪方法
    countlyTrackAll(store.state.login, to);

    if (to.matched.some(r => r.meta.development)) {
        Notice('fail', 'common.development')
        next(false);
        // MessageBox({
        //     title: i18n.t('common.prompt'),
        //     message: i18n.t('common.development'),
        //     confirmButtonText: i18n.t('common.ok')
        // }).then(action => {
        //     next(false);
        // });
        return;
    }

    if (to.matched.some(r => r.meta.requireAuth)) { // 判断该路由是否需要登录权限
        if (!store.state.login.token) { // 通过vuex state获取当前的token是否存在
            MessageBox({
                showCancelButton: true,
                title: i18n.t('common.prompt'),
                message: i18n.t('common.loginInfo'),
                confirmButtonText: i18n.t('common.ok'),
                cancelButtonText: i18n.t('common.cancel')
            }).then(action => {
                if (action === 'confirm') {
                    const authUrl = encodeURIComponent(`${location.origin}${location.pathname}#/login`);
                    if (to.name === 'profile') {
                        localStorage.backRoute = 'hna';
                    } else {
                        localStorage.backRoute = to.name;
                    }
                    if (Object.keys(to.query).length) {
                        localStorage.routeQuery = JSON.stringify(to.query);
                    }
                    if (Object.keys(to.params).length) {
                        localStorage.routeParams = JSON.stringify(to.params);
                    }
                    setTimeout(() => {
                        if (constants.DEVHOST.includes(location.hostname)) {
                            next({ name: 'login' });
                        } else {
                            location.href = `${api.login}?service=${authUrl}&params=${to.name}`;
                        }
                    }, 100);
                } else {
                    if (!from.name) {
                        next({ name: 'index' });
                    } else {
                        next(false);
                    }
                }
            });
            return;
        }
    }
    if (to.name === 'opinion') {
        if (localStorage.userMenu) {
            next({ name: localStorage.userMenu.split(',')[0] });
            return;
        } else {
            Notice('fail', 'common.competence');
            // MessageBox({
            //     title: i18n.t('common.prompt'),
            //     message: i18n.t('common.competence'),
            //     confirmButtonText: i18n.t('common.ok')
            // }).then(action => {
                if (!from.name) {
                    next({ name: 'index' });
                } else {
                    next(false);
                }
            // });
            return;
        }
    }
    next();
})

export default router;
