import api from '../../constants/api';
import sendClient from '../../common/sendClient';
// import Notice from '../../common/notice';
import constants from '../../constants/content';
import axios from '../../axios';
export default {
    state: {
        token: localStorage.token,
        userId: localStorage.userId,
        groupId: localStorage.groupId,
        userName: localStorage.userName,
        userMenu: localStorage.userMenu,
        roles: [
            {
                values: localStorage.roles && localStorage.roles.split(','),
                defaultIndex: parseInt(localStorage.roleIndex) || 0
            }
        ],
        rolesId: localStorage.rolesId && localStorage.rolesId.split(','),
        allMenu: [
            {
                name: '舆情速览',
                value: 'opinion-summary'
            },
            {
                name: '舆情报告',
                value: 'opinion-report'
            },
            {
                name: '敏感舆情',
                value: 'opinion-sensitive'
            },
            {
                name: '专项定制',
                value: 'opinion-special'
            }
        ],
        devData: {
            groupId: 81,
            roles: [
                { id: 8, name: '海航科技' },
                { id: 9, name: '海航旅业' },
                { id: 10, name: '海航资本' },
                { id: 11, name: '海航实业' },
                { id: 12, name: '海航创新金融' },
                { id: 13, name: '海航现代物流' },
                { id: 14, name: '海航集团' },
                { id: 15, name: '海航新传媒' }
            ],
            menu: [
                { id: 5, name: '舆情速览' },
                { id: 6, name: '舆情报告' },
                { id: 7, name: '敏感舆情' },
                { id: 8, name: '专项定制' }
            ],
            user: {
                id: 81,
                userName: localStorage.devUser || 'hhkjyqy'
            },
            auth: {
                token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJTU09fTE9HSU5fVElDS0VUX2hoa2p5cXkiLCJzY29wZXMiOlt7ImF1dGhvcml0eSI6IkdST1VQX0RFRkFVTFQifV0sImlzcyI6ImNvbS5obmEuYmlnZGF0YSIsImlhdCI6MTUwMjk1MzYyNywiZXhwIjoxNTA1NTQ1NjI3fQ.z6RSkKcczXoT2ZijHrMF5WZOD5Phsb-yk7R42LrsDEaBO98UBdWVO8W3y7gyds7XAcHKli6nsiHaXID8nYzFgw'
            }
        }
    },
    mutations: {
        setToken(state, data) {
            let menu = [];
            if (data.menu) {
                data.menu.forEach(item => {
                    state.allMenu.forEach(m => {
                        if (item.name === m.name) {
                            menu.push(m.value);
                        }
                    });
                });
            }
            if (data.auth && data.auth.token) {
                state.token = data.auth.token;
                localStorage.token = data.auth.token;
            }
            if (data.user && data.user.id) {
                state.userId = data.user.id;
                localStorage.userId = data.user.id;
            }
            if (data.user && data.user.userName) {
                state.userName = data.user.userName;
                localStorage.userName = data.user.userName;
                // Notice('success', data.user.userName);
                sendClient({ body: data.user.userName });
            }
            // 登录成功后获取当前roleId为用户组第一个
            if (data.roles && data.roles.length) {
                localStorage.roleId = localStorage.roleId || data.roles[0].id;
            }
            // 用户角色组name
            const rolesArr = [];
            // 用户角色组id
            const rolesIdArr = [];
            data.roles.forEach(item => {
                rolesArr.push(item.name);
                rolesIdArr.push(item.id);
            });
            // state、本地存储用户角色组name
            state.roles[0].values = rolesArr;
            localStorage.roles = rolesArr;
            // 存储当前用户角色
            localStorage.currentRole = rolesArr[parseInt(localStorage.roleIndex)] || rolesArr[0];
            // state、本地存储用户角色组id
            state.rolesId = rolesIdArr;
            localStorage.rolesId = rolesIdArr;
            state.groupId = data.groupId || '';
            localStorage.groupId = data.groupId || '';
            state.userMenu = menu.toString();
            localStorage.userMenu = menu.toString();
        },
        removeToken(state, type) {
            state.token = null;
            state.userId = null;
            state.groupId = null;
            state.userName = null;
            state.userMenu = null;
            const log = localStorage.log || '';
            const indexTip = localStorage.indexTip || '';
            const summaryTip = localStorage.summaryTip || '';
            const detailTip = localStorage.detailTip || '';
            localStorage.clear();
            sessionStorage.clear();
            sendClient({ body: true, type: 'logout' });
            localStorage.indexTip = indexTip;
            localStorage.summaryTip = summaryTip;
            localStorage.detailTip = detailTip;
            if (type) {
                localStorage.log = log;
            }
            if (constants.DEVHOST.includes(location.hostname)) {
                if (state.devData.user.userName === 'hhkjyqy') {
                    localStorage.devUser = 'guangh.zhang'
                } else {
                    localStorage.devUser = 'hhkjyqy'
                }
                location.href = `${location.origin}${location.pathname}`;
            } else {
                location.href = `${api.logout}?backUrl=${location.origin}${location.pathname}`;
            }
        }
    },
    actions: {
        sendLog({ commit, state }, type) {
            axios({
                method: 'post',
                url: api.log,
                data: {
                    userName: localStorage.userName,
                    log: localStorage.log
                }
            }).then(res => {
                if (type) {
                    commit('removeToken');
                } else {
                    localStorage.removeItem('log');
                }
                // Notice('success', 'log发送成功');
            }).catch(err => {
                if (type) {
                    commit('removeToken', true);
                }
                console.log(err);
                // Notice('success', 'log发送成功');
            })
        },
        authToken({ commit, state }, that) {
            if (constants.DEVHOST.includes(location.hostname)) {
                if (state.devData.auth) {
                    commit('setToken', state.devData);
                }
                that.authState = that.$t('login.validSuccess');
                that.jumpText = that.$t('login.clickBack');
                that.$parent.routerHistory = [];
                that.getOpinionRead(that);
                that.getNoReads(that);
                Countly.loginIsSuccess();
                setTimeout(() => {
                    that.Logger('登录');
                    that.$router.push({ name: localStorage.backRoute || that.router });
                    localStorage.removeItem('backRoute');
                }, 200);
                return;
            }
            that.$axios({
                method: 'post',
                baseURL: api.auth_baseUrl,
                url: api.auth,
                data: {
                    username: that.ssh,
                    password: that.ticket || that.bim || ''
                }
            }).then((res) => {
                that.loading = false;
                if (res && res.data) {
                    if (res.data.auth) {
                        commit('setToken', res.data);
                    }
                    that.authState = that.$t('login.validSuccess');
                    that.jumpText = that.$t('login.clickBack');
                    that.$parent.routerHistory = [];
                    that.getOpinionRead(that);
                    that.getNoReads(that);
                    Countly.loginIsSuccess();
                    setTimeout(() => {
                        if (localStorage.backRoute) {
                            let urlData = { name: localStorage.backRoute };
                            if (localStorage.routeQuery) {
                                urlData.query = JSON.parse(localStorage.routeQuery);
                            }
                            if (localStorage.routeParams) {
                                urlData.params = JSON.parse(localStorage.routeParams);
                            }
                            that.$router.push(urlData);
                        } else {
                            that.$router.push({ name: 'hna' });
                        }
                        console.log('start remove route cookie')
                        localStorage.removeItem('backRoute');
                        localStorage.removeItem('routeQuery');
                        localStorage.removeItem('routeParams');
                    }, 200);
                }
                that.Logger('登录');
            }, err => {
                that.loading = false;
                if (err) {
                    that.jumpText = that.$t('common.again');
                    that.authState = that.$t('login.validFailed');
                }
                that.Logger('登录');
            });
        }
    }
}
