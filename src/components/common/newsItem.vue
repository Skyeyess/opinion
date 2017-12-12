<template id="newsItem">
    <div class="news-item" @click="readed(news)">
        <router-link :to="{name: detailName || 'detail', query: { id: news.id, uid: news.uid, type: detailType || news.detailType, tags: news.tags, title: detailTitle || news.detailTitle }}">
            <div class="ni-label" v-show="news.sensitive" :class="{'no-readed': news.isRead === 2}">
                <span class="ni-btn" :class="news.sensitiveColor" v-text="$t(news.sensitive)"></span>
            </div>
            <div class="ni-title" :class="{'readed': news.isRead === 1, 'ni-title-top': !news.sensitive}" v-html="news.title"></div>
            <div class="ni-info">
                <span class="ni-time" v-text="news.time"></span>
                <span class="ni-count" v-text="$t('comment.count', [news.commentCount])"></span>
                <span class="ni-source" v-text="news.source"></span>
                <span class="ni-btn blue" v-show="news.company" v-text="$t(news.company)"></span>
            </div>
        </router-link>
    </div>
</template>
<script type="text/javascript">

export default {
    data() {
        return {}
    },
    props: {
        news: Object,
        detailName: String,
        detailType: String,
        detailTitle: String
    },
    methods: {
        readed(news) {
            const self = this;
            news.isRead = 1;
            self.$emit('readed', news);
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/common.scss';
.news-item {
    >a {
        padding: 0 .75rem 0 .9rem;
    }
    position: relative;
    font-size: .6rem;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    &:last-child {
        margin-bottom: .25rem;
    }
    .ni-title {
        width: 100%;
        color: #162734;
        font-size: .75rem;
        min-height: 2.1rem;
        line-height: 1.05rem;
        word-break: break-all;
        overflow: hidden;
        &.readed {
            color: #999;
        }
        b {
            color: #4A84F9;
        }
        &.ni-label-none {
            padding-top: .25rem;
        }
        &.ni-title-top {
            padding-top: .65rem;
        }
    }
    .ni-info {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        padding: 0.2rem 0 0.3rem;
        color: #c1cadc;
        line-height: normal;
        .ni-time {
            display: inline-block;
            min-width: 2.3rem;
            &.is-count {
                margin-right: 1rem;
            }
        }
        .ni-source {
            display: inline-block;
        }
        .ni-count {
            display: inline-block;
            min-width: 3rem;
            text-align: center;
            margin-right: 0.3rem;
        }
    }
    .ni-label {
        padding-top: .4rem;
        margin-left: -0.4rem;
        &.no-readed {
            &:before {
                content: ' ';
                display: inline-block;
                padding: 0.2rem;
                border-radius: 50%;
                background-color: #EA4E4E;
                position: relative;
                top: 0.9rem;
                right: 0.2rem;
            }
        }
    }
    .ni-btn {
        display: inline-block;
        font-size: .5rem;
        line-height: normal;
        padding: .075rem .2rem;
        margin-left: 1rem;
        box-sizing: border-box;
        margin-top: -.2rem;
        &.blue {
            position: absolute;
            right: 0;
            top: 0.4rem;
            color: #fff;
            padding: 0 .3rem;
            background-color: #68D2F9;
            border-radius: .1rem;
        }
        @each $color in orange,
        gold,
        red {
            &.#{$color} {
                text-align: center;
                margin-left: 0;
                color: #fff;
                background: url(#{$imgBase}label-#{$color}.png) no-repeat;
                background-size: 100% 100%;
                height: 1rem;
                line-height: normal;
                padding-top: .07rem;
                width: 2.6rem;
            }
        }
    }
}
</style>
