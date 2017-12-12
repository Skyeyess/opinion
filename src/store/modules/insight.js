import api from './../../constants/api.js';
import dataInit from '../../common/dataInit';

export default {
    state: {
        published: '已发布',
        tabsArr: [],
        tabContent: dataInit('first'),
        insightDetail: {},
        totalPage: null
    },
    mutations: {

    },
    actions: {
        getInsTags({commit, state}, that) {
            const options = {
                method: 'get',
                baseURL: api.auth_baseUrl,
                url: api.insightTag
            };
            that.$axios(options).then((res) => {
                state.tabsArr = res.data.hnaTypes;
                that.postTab = state.tabsArr[0];
            }).catch((err) => {
                console.log(err)
            })
        },
        getInsight({commit, state}, that) {
            state.tabContent = dataInit(that.state, state.tabContent);
            const options = {
                method: 'get',
                baseURL: api.auth_baseUrl,
                url: api.insight,
                params: {
                    title: '',
                    currentPage: state.tabContent.page,
                    showCount: 10,
                    status: state.published,
                    hnaType: that.postTab
                }
            };
            that.$axios(options).then((res) => {
                if (that.postTab === res.data.rows[0].hnaType) {
                    state.tabContent = that.formatData(that, res.data, state.tabContent);
                }
            }).catch(() => {
                state.tabContent = dataInit('error', state.tabContent);
            })
        }
    }
}
