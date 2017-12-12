<template>
    <div class="auth-container">
        <div class="auth-img" v-show="loading">
            <mt-spinner :type="2" color="#26a2ff"></mt-spinner>
        </div>
        <div class="auth-info" :class="{'mgt': !loading}" v-text="authState"></div>
        <div class="auth-btn" v-show="!loading">
            <mt-button type="primary" size="small" @click="jump" v-text="jumpText"></mt-button>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
    data() {
        return {
            ssh: 'SSO_LOGIN_TICKET',
            ticket: '',
            bim: '',
            authState: this.$t('login.valid'),
            loading: true,
            jumpText: this.$t('login.backHome')
        };
    },
    computed: {
        ...mapState({
            token: state => state.opinion.token
        })
    },
    activated() {
        const self = this;
        self.ticket = self.$route.query.ticket;
        self.bim = self.$route.query.user;
        if (self.ticket) {
            localStorage.loginType = 'iam';
            self.ssh = 'SSO_LOGIN_TICKET';
        }
        if (self.bim) {
            localStorage.loginType = 'bim';
            self.ssh = 'BIM_LOGIN_TICKET';
        }
        self.router = self.$route.query.params;
        self.authToken(self);
    },
    methods: {
        ...mapActions(['authToken', 'getOpinionRead', 'getNoReads']),
        jump() {
            const self = this;
            if (self.jumpText === self.$t('common.again')) {
                self.authToken(self);
                return;
            }
            self.getOpinionRead(self);
            self.getNoReads(self);
            self.$parent.routerHistory = [];
            if (self.token) {
                if (localStorage.backRoute) {
                    let urlData = { name: localStorage.backRoute };
                    if (localStorage.routeQuery) {
                        urlData.query = JSON.parse(localStorage.routeQuery);
                    }
                    if (localStorage.routeParams) {
                        urlData.params = JSON.parse(localStorage.routeParams);
                    }
                    self.$router.push(urlData);
                } else {
                    self.$router.push({ name: 'hna' });
                }
                console.log('start remove route cookie')
                localStorage.removeItem('backRoute');
                localStorage.removeItem('routeQuery');
                localStorage.removeItem('routeParams');
            } else {
                self.$router.push({ name: 'index' });
            }
        }
    }
}
</script>
<style lang="scss">
.auth-container {
    width: 10rem;
    height: 6rem;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -5rem;
    margin-top: -3rem;
    font-family: 'PingFangSC-Regular', 'PingFang SC';
    .auth-img {
        .mint-spinner-triple-bounce>div {
            width: .5rem !important;
            height: .5rem !important;
        }
    }
    .auth-info {
        font-size: .9rem;
        margin-top: .5rem;
        color: #666;
        &.mgt {
            margin-top: 1.4rem;
        }
    }
    .auth-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        button {
            width: 100%;
            font-size: .7rem;
            padding: 0 .6rem;
            height: 1.65rem;
        }
    }
}
</style>
