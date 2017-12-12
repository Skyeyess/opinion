<template id="commentItem">
  <div class="comment-item clearfix" v-if="!comment.deleted">
    <div class="comment-img left">
      <img :src="comment.photo" :alt="comment.name">
    </div>
    <div class="comment-detail left">
      <div class="cd-top clearfix">
        <div class="comment-user left" v-text="comment.name"></div>
        <span class="zan-block right" :class="{'active': comment.isLike}" @click="like(comment),Logger('点赞')">
          <i class="block cl-icon iconfont icon-zan-o" :class="{'icon-zan': comment.isLike, 'land-animated': comment.laud}"></i>
        </span>
        <div class="comment-like right">
          <em class="cl-count" :class="{'count-blue': comment.isLike}" v-text="comment.like"></em>
        </div>
      </div>
      <div class="cd-center" v-html="comment.content"></div>
      <div class="cd-replylist" v-if="comment.replyCount">
        <div class="cdr-item clearfix" v-for="(reply, index) of comment.replylist" :key="index">
          <em class="cdri-name">{{reply.name}}:</em>
          <em class="cdri-content" v-html="reply.content"></em>
        </div>
        <router-link class="cdr-all" :to="{name: 'commentDetail', query:{ commonId: comment.id, newsId: comment.targetId }}">
          <em v-text="$t('comment.replyCount', [comment.replyCount])"></em>
        </router-link>
      </div>
      <div class="cd-bottom clearfix">
        <em class="cdb-time left" v-text="comment.time"></em>
        <!-- <em class="cdb-reply" @click="reply(comment, $event),Logger('回复TA')">{{$t('comment.replyTo')}}TA</em>
        <div class="comment-operate" @click.stop="operate(comment),Logger('更多操作')">
          <em v-text="$t('comment.more')"></em>
        </div> -->
        <!-- <div class="co-item clearfix" v-show="comment.operate"> -->
          <em class="coi-reply right" @click.stop="reply(comment, $event),Logger('回复评论')" v-text="$t('comment.reply')"></em>
          <em class="coi-del right" v-show="comment.self" @click.stop="remove(comment),Logger('删除评论')" v-text="$t('common.delete')"></em>
          <em class="coi-report right" v-show="!comment.self" @click.stop="report(comment),Logger('投诉评论')" v-text="$t('comment.report')"></em>
        <!-- </div> -->
      </div>
      <div class="cd-original" v-if="comment.detailType">
        <router-link :to="{name: 'detail', query: {id: comment.targetId, type: comment.detailType}}">
          <span v-text="$t('common.original')"></span>
          <span class="original-text" v-text="comment.title"></span>
          <i class="iconfont icon-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      current: '',
      likeId: '',
      deleteId: ''
    }
  },
  props: {
    comment: Object
  },
  methods: {
    ...mapActions(['addLike', 'delLike', 'delComment']),
    like(comment) {
      const self = this;
      self.likeId = comment.id;
      if (comment.isLike) {
        comment.laud = false;
        comment.isLike = 0;
        comment.like -= 1;
        self.delLike(self);
        self.Notice('success', 'comment.liked');
      } else {
        comment.laud = true;
        setTimeout(() => {
          comment.laud = false;
        }, 850);
        comment.isLike = 1;
        comment.like += 1;
        self.addLike(self);
      }
    },
    // operate(comment) {
    //   const self = this;
    //   comment.operate = !comment.operate;
    //   if (comment.operate) {
    //     document.body.addEventListener('click', () => {
    //       comment.operate = false;
    //     });
    //   }
    //   self.$emit('operate', comment);
    // },
    reply(comment, event) {
      const self = this;
      const eventY = event.y
      // comment.operate = false;
      self.$emit('reply', { comment, eventY });
    },
    remove(comment) {
      const self = this;
      // comment.operate = false;
      self.deleteId = comment.id;
      self.current = comment;
      self.$messagebox({
        showCancelButton: true,
        title: self.$t('common.prompt'),
        message: self.$t('common.sureDelete'),
        confirmButtonText: self.$t('common.ok'),
        cancelButtonText: self.$t('common.cancel')
      }).then(action => {
        if (action === 'confirm') {
          self.delComment(self);
        }
      });
    },
    report(comment) {
      const self = this;
      // comment.operate = false;
      self.$emit('report', comment);
    }
  }
}

</script>
<style lang="scss">
@import '../../assets/common.scss';
.comment-item {
  padding: 0.8rem 0 0 0.8rem;
  .comment-img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-right: 0.4rem; // background-color: #afafaf;
    color: #ffffff;
    text-align: center;
    line-height: 2rem;
    font-size: 0.75rem;
    img {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }
  }
  .comment-detail {
    width: calc(100% - 2.4rem);
    padding: 0 0.7rem 0.45rem 0.1rem;
    border-bottom: 1px solid #eee;
    .cd-top {
      font-size: 0.6rem;
      margin-bottom: 0.8rem;
      color: #11202B;
      height: 1rem;
      line-height: 1rem;
      position: relative;
      .comment-user {
        font-size: .7rem;
      }
      .zan-block {
        position: relative;
        display: inline-block;
        width: 1rem;
        height: 1rem;
        color: #b8c2dd;
        .like-img {
          width: 50px;
          position: absolute;
          max-width: none;
          left: -17px;
          top: -29px;
        }
        &.active {
          color: #4E87F9;
        }
      }
      .comment-like {
        color: #b8c2dd;
        margin-right: 0.4rem;
        .cl-count {
          font-size: 0.6rem;
          vertical-align: middle;
          &.count-blue {
            color: #4E87F9;
          }
        }
      }
    }
    .cd-center {
      margin-bottom: 0.4rem;
      font-size: 0.8rem;
      line-height: 1rem;
      color: #11202b;
      word-break: break-all;
    }
    .cd-replylist {
      width: 100%;
      border-radius: 0.02rem;
      padding: 0.25rem 0.5rem 0.4rem;
      margin-bottom: 0.4rem;
      background-color: #f4f7f8;
      .cdr-item {
        margin-bottom: 0.4rem;
        .cdri-name {
          color: #4E87F9;
          font-size: 0.75rem;
          margin-right: 0.25rem;
        }
        .cdri-content {
          color: #11202B;
          font-size: 0.75rem;
          line-height: 1rem;
          word-break: break-all;
          em {
            color: #4E87F9;
          }
        }
      }
      .cdr-all {
        color: #A1B4DA;
        font-size: 0.75rem;
        line-height: 0.85rem;
      }
    }
    .cd-bottom {
      color: #a1b4da;
      font-size: 0.6rem;
      position: relative;
      .cdb-time, .coi-del, .coi-report {
        margin-right: 0.5rem;
      }
      .comment-operate {
        width: 2.4rem;
        text-align: right;
        margin-left: 0.65rem;
      }
      .co-item {
        position: absolute;
        top: -0.3rem;
        right: 2.2rem;
        height: 1.6rem;
        padding-right: 0.5rem;
        background-image: url('#{$imgBase}comment-operate.png');
        background-size: 100% 100%;
        border-radius: 0.2rem;
        z-index: 10;
        em {
          position: relative;
          font-size: 0.6rem;
          color: #ffffff;
          padding: 0.35rem;
          line-height: normal;
          &:first-child:after {
            content: "";
            position: absolute;
            opacity: 0.19;
            top: 0.475rem;
            right: -0.5px;
            width: 1px;
            height: 0.65rem;
            border-radius: 0.2rem;
            background-color: #ffffff;
          }
        }
      }
    }
    .cd-original {
      >a {
        padding: 0.25rem 0.5rem 0.25rem 0.5rem;
        background: #F4F7F9;
        border-radius: .9rem;
        font-size: .6rem;
        color: #A1B4DA;
        margin-top: .9rem;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        -webkit-align-items: center;
        align-items: center;
        >* {
          vertical-align: text-bottom;
        }
        >span {
          margin-right: .5rem;
        }
        >.original-text {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: 80%;
          margin-right: 0;
        }
        >.icon-arrow-right {
          font-size: .6rem;
        }
      }
    }
  }
}
</style>
