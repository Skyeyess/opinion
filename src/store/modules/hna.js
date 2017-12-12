import store from '../../store';
import dataInit from '../../common/dataInit';
import api from '../../constants/api';
import content from '../../constants/content';

export default {
    state: {
        hnaItemType: [[{
            groupId: 14,
            name: '海航集团',
            image: `${content.prototype.imgBase}hna01.jpg`
        }, {
            groupId: 8,
            name: '海航科技',
            image: `${content.prototype.imgBase}hna02.jpg`
        }], [{
            groupId: 9,
            name: '海航旅业',
            image: `${content.prototype.imgBase}hna03.jpg`
        }, {
            groupId: 10,
            name: '海航资本',
            image: `${content.prototype.imgBase}hna04.jpg`
        }], [{
            groupId: 11,
            name: '海航实业',
            image: `${content.prototype.imgBase}hna05.jpg`
        }, {
            groupId: 13,
            name: '海航现代物流',
            image: `${content.prototype.imgBase}hna06.jpg`
        }], [{
            groupId: 12,
            name: '海航创新金融',
            image: `${content.prototype.imgBase}hna07.jpg`
        }, {
            groupId: 15,
            name: '海航新传媒',
            image: `${content.prototype.imgBase}hna08.jpg`
        }]],
        hnaNews: dataInit('first'),
        hnaItemNews: dataInit('first')
    },
    actions: {
        getHnaNews({ commit, state }, that) {
            state.hnaNews = dataInit(that.state, state.hnaNews);
            let params = {
                currentPage: state.hnaNews.page,
                showCount: 10,
                startDate: that.getTimeStamp(15),
                endDate: that.getTimeStamp(0),
                roleId: 14,
                username: localStorage.userName || ''
            };
            that.$axios.get(api.hna_news, {
                params
            }).then(res => {
                state.hnaNews = that.formatData(that, res.data, state.hnaNews);
            }).catch(() => {
                state.hnaNews = dataInit('error', state.hnaNews);
            })
        },
        getHnaItemNews({ commit, state }, that) {
            state.hnaItemNews = dataInit(that.state, state.hnaItemNews);
            let params = {
                currentPage: state.hnaItemNews.page,
                showCount: 10,
                startDate: that.getTimeStamp(15),
                endDate: that.getTimeStamp(0),
                roleId: that.groupId || '',
                username: localStorage.userName || ''
            };
            that.$axios.get(api.hna_news, {
                params
            }).then(res => {
                state.hnaItemNews = that.formatData(that, res.data, state.hnaItemNews);
            }).catch(() => {
                state.hnaItemNews = dataInit('error', state.hnaItemNews);
            })
        },
        getRoles({commit, state}, that) {
            const options = {
                method: 'post',
                url: api.rolesArr,
                baseURL: api.auth_baseUrl,
                data: {
                    userName: localStorage.userName
                }
            }
            that.$axios(options)
                .then((res) => {
                    const data = res.data;
                    if (data && !data.length) {
                        localStorage.userMenu = '';
                        return;
                    }
                    // 登录成功后获取当前roleId为用户组第一个
                    if (data && data.length) {
                        localStorage.roleId = localStorage.roleId || data[0].id;
                        localStorage.groupId = data[0].groupId;
                    }
                    // 用户角色组name
                    const rolesArr = [];
                    // 用户角色组id
                    const rolesIdArr = [];
                    if (data instanceof Array) {
                        data.forEach(item => {
                            rolesArr.push(item.name);
                            rolesIdArr.push(item.id);
                        });
                    }
                    // state、本地存储用户角色组name
                    localStorage.roles = rolesArr;
                    store.state.login.roles[0].values = rolesArr
                    // state、本地存储用户角色组id
                    localStorage.rolesId = rolesIdArr;
                    store.state.login.rolesId = rolesIdArr;
                    if (!rolesIdArr[localStorage.roleIndex]) {
                        localStorage.roleIndex = 0;
                        store.state.login.roles[0].defaultIndex = 0;
                        localStorage.roleId = rolesIdArr[0];
                        // 存储当前用户角色
                        localStorage.currentRole = rolesArr[localStorage.roleIndex];
                    } else {
                        localStorage.roleId = rolesIdArr[localStorage.roleIndex];
                        localStorage.currentRole = rolesArr[localStorage.roleIndex];
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}
