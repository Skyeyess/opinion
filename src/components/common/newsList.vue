<template id="newsList">
    <div class="news-list">
        <slot name="none">
            <div class="common-none" v-show="newsData.status" @click="loadAgain">
                <span v-show="newsData.none">{{ $t("common.noNews") }}</span>
                <mt-spinner v-show="newsData.loading" :type="0"></mt-spinner>
                <span v-show="newsData.error">{{ $t("common.loadFailed") }}</span>
            </div>
        </slot>
        <slot name="item">
            <news-item v-for="(news, index) in newsData.list" :key="news.id" :news="news" :detail-name="detailName" :detail-type="detailType" :detail-title="detailTitle" @readed="readed"></news-item>
        </slot>
    </div>
</template>
<script type="text/javascript">
import newsItem from './newsItem';
export default {
    props: {
        newsData: Object,
        detailName: String,
        detailType: String,
        detailTitle: String
    },
    methods: {
        loadAgain() {
            const self = this;
            if (self.newsData.error) {
                self.$emit('getList', 'first');
            }
        },
        readed(news) {
            const self = this;
            self.$emit('readed', news);
        }
    },
    components: {
        newsItem
    }
}
</script>
<style lang="scss">
.news-list {
    .common-none {
        display: block;
        height: 6rem;
        line-height: 6rem;
        font-size: .7rem;
        color: #333;
        background-color: #fff;
        text-align: center;
        border-bottom: 1px solid #eee;
        .mint-spinner-snake {
            height: 1.4rem !important;
            width: 1.4rem !important;
            text-align: center;
            display: inline-block;
            margin-top: 2.3rem;
        }
    }
}
</style>
