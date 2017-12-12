import Vue from 'vue';
// import Vuex from 'vuex';

import app from './modules/app';
import insight from './modules/insight';
import hna from './modules/hna';
import home from './modules/home';
import opinion from './modules/opinion';
import login from './modules/login';
import chartDetail from './modules/chartDetail';
import detail from './modules/detail';
import search from './modules/search';
import profile from './modules/profile';
import sensitive from './modules/sensitive';
import special from './modules/special';
import message from './modules/message';
import hotSpot from './modules/hotSpot';
import wordDetail from './modules/wordDetail';
import collection from './modules/collection';
import comment from './modules/comment';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        app,
        insight,
        hna,
        home,
        opinion,
        login,
        detail,
        chartDetail,
        search,
        profile,
        sensitive,
        special,
        message,
        hotSpot,
        wordDetail,
        collection,
        comment
    },
    trict: debug
});
