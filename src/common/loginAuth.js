import api from '../constants/api.js';
import constants from '../constants/content';
export default (that) => {
    that.$messagebox({
        showCancelButton: true,
        title: that.$t('common.prompt'),
        message: that.$t('common.loginInfo'),
        confirmButtonText: that.$t('common.ok'),
        cancelButtonText: that.$t('common.cancel')
    }).then(action => {
        if (action === 'confirm') {
            const authUrl = encodeURIComponent(`${location.origin}${location.pathname}#/login`);
            if (that.$route.name === 'profile') {
                localStorage.backRoute = 'hna';
            } else {
                localStorage.backRoute = that.$route.name;
            }
            if (Object.keys(that.$route.query).length) {
                localStorage.routeQuery = JSON.stringify(that.$route.query);
            }
            if (Object.keys(that.$route.params).length) {
                localStorage.routeParams = JSON.stringify(that.$route.params);
            }
            setTimeout(() => {
                if (constants.DEVHOST.includes(location.hostname)) {
                    that.$router.push({ name: 'login' });
                } else {
                    location.href = `${api.login}?service=${authUrl}&params=${that.$route.name}`;
                }
            }, 100);
        }
    });
}
