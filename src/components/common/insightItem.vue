<template>
  <div class="insight-item">
    <a @click="open(insight)" :href="download">
      <div class="insight-img">
        <img class="pdf-img" v-lazy="insight.image">
        <span class="pdf-shade"></span>
        <img class="pdf-icon" v-if="insight.icon" :src="insight.icon">
      </div>
      <div class="content">
        <h4 class="tit" v-text="insight.title"></h4>
        <div class="extral">
          <span><i class="iconfont icon-time"></i>{{ insight.time }}</span>
          <span v-if="insight.author" v-text="insight.author"></span>
          <span><i class="iconfont icon-link"></i>{{ insight.source }}</span>
        </div>
      </div>
    </a>
  </div>
</template>
<script>
export default {
  data () {
    return {
      download: null
    }
  },
  props: {
    insight: Object
  },
  methods: {
    open(insight) {
      const self = this;
      if (localStorage.loginType && localStorage.loginType === 'bim') {
          self.download = insight.url;
      }
      if (insight.content) {
        self.$router.push({ name: 'insightDetails', query: { content: insight.content } });
      } else {
        self.sendClient({ body: insight.url, type: 'pdf' });
      }
    }
  }
}

</script>
