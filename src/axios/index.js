import axios from 'axios';
import store from '../store';
// import router from '../router';
import i18n from '../language';
// import { MessageBox } from 'mint-ui';
import api from '../constants/api';
import Notice from '../common/notice';
import router from '../router';

// axios 配置
axios.defaults.baseURL = '/hnaData/api/v3';
// axios.defaults.baseURL = '/api/v3';
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers['isApp'] = 'y';

// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (store.state.login.token) {
            config.headers['X-Authorization'] = `Bearer ${store.state.login.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401: // 401 清除token信息并跳转到登录页面
                    MessageBox({
                        title: i18n.t('common.prompt'),
                        message: i18n.t('common.expired'),
                        confirmButtonText: i18n.t('common.ok')
                    }).then(action => {
                        if (action === 'confirm') {
                            store.state.login.token = null;
                            store.state.login.userId = null;
                            store.state.login.groupId = null;
                            store.state.login.userName = null;
                            store.state.login.userMenu = null;
                            const log = localStorage.log || '';
                            const indexTip = localStorage.indexTip || '';
                            const summaryTip = localStorage.summaryTip || '';
                            const detailTip = localStorage.detailTip || '';
                            localStorage.clear();
                            sessionStorage.clear();
                            localStorage.indexTip = indexTip;
                            localStorage.summaryTip = summaryTip;
                            localStorage.detailTip = detailTip;
                            localStorage.log = log;
                            location.href = `${api.logout}?backUrl=${location.origin}${location.pathname}`;
                            // router.push({name: 'index'});
                        }
                    });
                    break;
                case 503:
                    router.push({name: 'maintain'})
                    localStorage.appMessage = error.response.data
                    break;
                case 504:
                    // MessageBox({
                    //     title: i18n.t('common.prompt'),
                    //     message: i18n.t('common.serverError'),
                    //     confirmButtonText: i18n.t('common.ok')
                    // });
                    Notice('fail', i18n.t('common.serverError'))
                    break;
                default:
                    console.log(error.response.status)
            }
        }
        return Promise.reject(error)
    }, 5000);

export default axios;
