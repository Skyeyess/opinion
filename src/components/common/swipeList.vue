<template id="swipeList">
    <div class="swipe-list">
        <news-list :news-data="newsData" @getList="getList">
            <div slot="item">
                <mt-cell-swipe v-for="(news, index) in newsData.list" :key="index" :right="[{
                    content: news.isPush ? `${$t('common.noPush')}` : `${$t('common.rePush')}`,
                    style: { background: '#cccccc', color: '#fff' },
                    handler: () => $messagebox({
                        title: `${$t('common.prompt')}`,
                        message: news.isPush ? `${$t('common.isNoPush')}` : `${$t('common.isRePush')}`,
                        confirmButtonText: `${$t('common.ok')}`,
                        cancelButtonText: `${$t('common.cancel')}`,
                        showCancelButton: true
                    }).then(action => {
                        if(action === 'confirm'){
                            Logger('不再推送')
                            stopPush(news)
                        }
                    })
                }, {
                    content: `${$t('common.delete')}`,
                    style: { background: '#fa3f3f', color: '#fff' },
                    handler: () => $messagebox({
                        title: `${$t('common.prompt')}`,
                        message: news.isPush ? `${$t('common.isDelete')}` : `${$t('common.noRevertDelete')}`,
                        confirmButtonText: news.isPush ? `${$t('common.delete')}` : `${$t('common.sureDelete')}`,
                        confirmButtonClass: news.isPush ? 'del' : '',
                        cancelButtonText: `${$t('common.cancel')}`,
                        showCancelButton: true
                    }).then(action => {
                        if(action === 'confirm'){
                            Logger('删除推送')
                            getNewsId(news, index)
                        }
                    })
                }]">
                    <news-item :news="news" :detail-name="detailName" :detail-type="detailType" :detail-title="detailTitle" @readed="readed"></news-item>
                </mt-cell-swipe>
            </div>
        </news-list>
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
        readed(news) {
            const self = this;
            self.$emit('readed', news);
        },
        getList(state) {
            const self = this;
            self.$emit('getList', state);
        },
        stopPush(news) {
            const self = this;
            self.$emit('stopPush', news);
        },
        getNewsId(news, index) {
            const self = this;
            self.$emit('getNewsId', { news, index });
        }
    },
    components: {
        newsItem
    }
}
</script>
<style lang="scss">
.swipe-list {
    .mint-cell.mint-cell-swipe {
        border-bottom: 1px solid #eee;
        .mint-cell-wrapper {
            padding: 0;
            .mint-cell-value {
                display: block;
                width: 100%;
                .news-item {
                    margin-bottom: 0;
                    border-bottom: none;
                    .ni-title {
                        &.ni-title-top {
                            text-decoration: line-through;
                        }
                    }
                }
            }
        }
        .mint-cell-right {
            .mint-cell-swipe-buttongroup {
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
            }
            .mint-cell-swipe-button {
                padding: 0 1rem;
                height: 100%;
                font-size: .8rem;
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
            }
        }
    }
}
</style>
