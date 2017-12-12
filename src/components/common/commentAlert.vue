<template>
  <div class="common-modal" v-show="!commentInput" @click.self="$parent.commentInput = true">
    <div class="comment-alert">
      <div class="opt-btn">
        <div class="opt-cancel" @click="cancelAlert">{{$t('common.cancel')}}</div>
        <div class="opt-title">{{$t('common.comment')}}</div>
        <div class="opt-publish" :class="{'publish-active': commentText && commentText.length !== 150}" @click="sendComment()">{{$t('comment.send')}}</div>
      </div>
      <textarea class="text-box" v-model="commentText" maxlength="150" @focus="iosPush" :placeholder="commentPlace" no-resize></textarea>
      <div class="max-text">{{ commentText.length > 150 ? 0 : (150 - commentText.length) }}{{$t('comment.word')}}</div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      commentSend: true,
      commentText: '',
      interval: null
    }
  },
  props: {
    current: String,
    requestData: Object,
    commentInput: Boolean,
    commentPlace: String,
    replyMode: Number
  },
  watch: {
    commentInput(newValue, oldValue) {
      const self = this;
      if (!newValue) {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          self.$parent.commentInput = true
          self.sendClient({ body: self.commentPlace, type: 'commentOpen' })
          return;
        }
        self.$nextTick(() => {
          if (!self.requestData.commentType || !/(Android)/i.test(navigator.userAgent)) {
            document.querySelector('.text-box').focus();
          } else {
            document.querySelector('.text-box').focus();
            const alertEle = document.querySelector('.comment-alert');
            const scrollY = self.replyMode - document.body.clientHeight / 2;
            let interval = document.body.clientHeight / 2;
            if (scrollY > 20) {
              interval = interval - scrollY;
            } else {
              interval = interval - 20;
            }
            alertEle.style.paddingBottom = `${interval}px`;
          }
        });
      } else {
        document.querySelector('.comment-alert').style.paddingBottom = '1rem';
      }
    }
  },
  mounted() {
    const self = this;
    window.addEventListener('storageEvent', function(e) {
      if (e.storageKey === 'keyboard') {
        if (e.storageValue === 'close') {
          document.querySelector('.comment-alert').style.paddingBottom = '1rem';
        }
      }
      if (e.storageKey === 'commentContent') {
        self.commentText = e.storageValue;
        if (self.$route.name === self.current) {
          self.sendComment()
        }
      }
    });
  },
  methods: {
    ...mapActions(['addComment']),
    iosPush() {
      // const self = this;
      // if (document.body.scrollTop !== document.body.scrollHeight) {
      //   document.body.scrollTop = document.body.scrollHeight;
      //   requestAnimationFrame(self.iosPush);
      // }
    },
    sendComment() {
      const self = this;
      if (!self.commentText || self.commentText.length > 150) {
        return;
      }
      if (!self.commentSend) {
        self.Notice('success', 'comment.sending');
        return;
      }
      self.commentSend = false;
      self.requestData.content = self.commentText;
      if (!self.requestData.commentType) {
        self.Logger('发送评论');
      }
      console.log(self.requestData)
      self.addComment(self);
    },
    cancelAlert() {
      const self = this;
      self.$parent.commentInput = true;
      self.commentText = '';
    }
  }
}

</script>
<style lang="scss">
.comment-alert {
		width: 100%;
		position: fixed;
		z-index: 100;
		bottom: 0;
		left: 0;
		right: 0;
		line-height: 0;
		padding: 0 0.5rem 0.5rem;
		background: #fff;
		.max-text {
			height: 1rem;
			line-height: normal;
			text-align: right;
			font-size: .7rem;
			color: #A1B4DA;
			background: #F4F7F8;
			padding-right: .5rem;
			position: absolute;
      width: calc(100% - 1rem);
      width: -webkit-calc(100% - 1rem);
      right: .5rem;
      top: 6.2rem;
		}
		.opt-btn {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-justify-content: space-between;
		    justify-content: space-between;
		    height: 2.2rem;
		    font-size: .7rem;
		    color: #152734;
		    .opt-cancel, .opt-publish {
		    	height: 100%;
		    	line-height: 2.2rem;
		    }
		    .opt-publish {
		    	color: #A1B4DA;
		    }
		    .publish-active {
		    	color: #4E87F9;
		    }
		    .opt-title {
		    	font-size: .8rem;
				color: #152734;
				line-height: 2.2rem;
		    }
		}
		.text-box {
			padding: .5rem;
			padding-bottom: 1rem;
			width: 100%;
			resize: none;
			height: 5rem;
			border: none;
			color: #152734;
			font-size: .7rem;
			background: #F4F7F8;
			&::-webkit-input-placeholder  {
				color: #A1B4DA;
			}
		}
	}
</style>
