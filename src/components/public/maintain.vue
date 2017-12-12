<template>
    <div class="maintain-container">
        <div class="maintain-img"><img src="http://test-1255428994.file.myqcloud.com/icon_whz%403x.png"></div>
        <div class="maintain-text">{{ message }}</div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            message: localStorage.appMessage
        }
    }
}
</script>
<style lang="scss">
.maintain-container {
    width: 100%;
    height: 6rem;
    text-align: center;
    position: absolute;
    top: 50%;
    margin-top: -3rem;
    font-family: 'PingFangSC-Regular', 'PingFang SC';
    .maintain-img {
        width: 16%;
        margin: 0 auto;
    }
    .maintain-text {
        width: 45%;
        font-size: 0.75rem;
        color: #888;
        line-height: 1.25rem;
        margin: 0.65rem auto 0;
    }
}
</style>
