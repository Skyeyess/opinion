<template id="loadMore">
    <mt-loadmore :auto-fill="autoFill" :top-method="refresh" :bottom-method="loadBottom" :bottom-all-loaded="newsData.end" :bottomPullText="$t('common.loadmore')" :bottomDropText="$t('common.releaseUpdate')" :bottomLoadingText="$t('common.loading')" :topPullText="''" :topLoadingText="''" :topDropText="''" :ref="refName">
        <slot name="header"></slot>
        <slot name="main">
            <news-list :news-data="newsData" :detail-name="detailName" :detail-type="detailType" :detail-title="detailTitle" @getList="getList" @readed="readed">
            </news-list>
        </slot>
        <slot name="footer"></slot>
        <slot name="end">
            <div class="to-end" v-show="newsData.total >= endCount && newsData.end">{{ $t(endInfo || 'common.toEnd') }}</div>
        </slot>
    </mt-loadmore>
</template>
<script>
export default {
    data() {
        return {
            autoFill: false,
            endCount: 8
        }
    },
    props: {
        refName: String,
        endInfo: String,
        newsData: Object,
        detailName: String,
        detailType: String,
        detailTitle: String
    },
    watch: {
        'newsData.list'(newVal) {
            if (newVal && newVal.length) {
                const self = this;
                self.$nextTick(() => {
                    const interval = self.getEleHeight(`.${self.newsData.type}-list`);
                    const item = document.querySelector(`.${self.newsData.type}-item`);
                    if (item) {
                        const itemHeight = item.offsetHeight;
                        self.endCount = Math.round(interval / itemHeight);
                        console.log(self.endCount)
                    }
                })
            }
        }
    },
    methods: {
        readed(news) {
            const self = this;
            self.$emit('readed', news);
        },
        getList(state) {
            const self = this;
            self.$emit('getList', state);
        },
        refresh() {
            const self = this;
            const parent = self.$parent;
            sessionStorage.refreshTime = new Date().getTime();
            const refreshEle = document.querySelector('.mint-loadmore-top');
            refreshEle.style.backgroundImage = `url(${self.imgBase}loading.gif?${Math.random()})`;
            parent.$refs[self.refName] = self.$refs[self.refName];
            self.$emit('getList', 'refresh');
        },
        loadBottom() {
            const self = this;
            const parent = self.$parent;
            parent.$refs[self.refName] = self.$refs[self.refName];
            self.$emit('getList', 'next');
        }
    }
}
</script>
<style lang="scss">
.mint-loadmore-top {
    background-size: 100% 100%;
    .mint-loadmore-spinner {
        display: none !important;
    }
}

.to-end {
    height: 1.2rem;
    color: #999;
    text-align: center;
    line-height: 1.2rem;
}
</style>
