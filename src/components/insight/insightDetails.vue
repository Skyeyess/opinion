<template>
    <div class="insight-details-wrapper">
        <div class="detail-interval"></div>
        <div class="detail-main" v-html="hnaContent"></div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                hnaContent: ''
            }
        },
        activated() {
            const self = this;
            self.hnaContent = self.$route.query.content;
        }
    }
</script>
<style lang="scss">
    .insight-details-wrapper{
        padding-top: 3.2rem;
        height:100%;
        overflow:auto;
        position: relative;
        background-color: #fff;
        -webkit-overflow-scrolling: touch;
        .detail-interval {
            width: 100%;
            height: 0.3rem;
            background: #f4f7f9;
        }
        .detail-main {
            font-size: 0.8rem;
            line-height: 1.3rem;
            color: #152734;
            padding: 0.5rem 1rem;
            line-height: 1.5rem;
            width: 100%;
            p {
                margin-bottom: 1rem;
                text-indent: 2rem;
                word-break: break-word;
                &:last-child {
                    margin-bottom: 0;
                }
                &:empty{
                    display:none;
                }
            }
            img {
                margin-bottom: 1rem;
            }
        }
    }
</style>
