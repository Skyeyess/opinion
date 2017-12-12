import Vue from 'vue';
// import VueI18n from 'vue-i18n';

import cn from './locale-cn';
import en from './locale-en';

let messages = { cn, en };
Vue.use(VueI18n); // 注册国际化插件

export default new VueI18n({
  locale: localStorage.language || 'cn',
  messages
});
