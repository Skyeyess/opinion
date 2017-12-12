<template id="commentList">
  <div class="comment-list">
    <slot name="none">
      <div class="common-none" v-show="commentData.status" @click="loadAgain">
        <div class="comment-none" v-show="commentData.none">
          <div class="cn-img">
            <img :src="imgBase + 'comment-none.png'" alt="comment-none">
          </div>
          <div class="cn-info" v-text="$t('comment.none')"></div>
        </div>
        <mt-spinner v-show="commentData.loading" :type="0"></mt-spinner>
        <span v-show="commentData.error">{{ $t("common.loadFailed") }}</span>
      </div>
    </slot>
    <slot name="item">
      <comment-item v-for="(comment, index) of commentData.list" :key="comment.id" :comment="comment" @reply="reply" @remove="remove" @report="report">
      </comment-item>
    </slot>
  </div>
</template>
<script>
export default {
  props: {
    commentData: Object
  },
  watch: {
    'commentData.none'(newVal) {
      if (newVal) {
        const self = this;
        self.$nextTick(() => {
          self.getEleHeight('.comment-none');
        })
      }
    }
  },
  methods: {
    loadAgain() {
      const self = this;
      if (self.commentData.error) {
        self.$emit('getList', 'first');
      }
    },
    reply(comment) {
      const self = this;
      self.$emit('reply', comment);
    },
    // operate(comment) {
    //   const self = this;
    //   self.$emit('operate', comment);
    // },
    remove(comment) {
      const self = this;
      self.$emit('remove', comment);
    },
    report(comment) {
      const self = this;
      self.$emit('report', comment);
    }
  }
}

</script>
<style lang="scss">
.comment-list {
  background-color: #ffffff;
  .common-none {
    height: auto!important;
    display: block;
    min-height: 6rem;
    line-height: 6rem;
    font-size: .7rem;
    color: #333;
    background-color: #fff;
    text-align: center;
    border-bottom: 1px solid #eee;
    .comment-none {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      flex-direction: column;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-align-items: center;
      align-items: center;
      .cn-img {
        width: 3rem;
        height: 3rem;
        margin-bottom: 0.5rem;
      }
      .cn-info {
        font-size: 0.75rem;
        color: #A1B4DA;
      }
    }
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
