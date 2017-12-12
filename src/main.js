import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import i18n from './language';
import axios from './axios';
import common from './common';
import components from './components/common';
import directives from './directives';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import constants from './constants/content';

// 初始化countly
Countly.init({
  app_key: 'cdec61f77b11293e3b43e95cbb4a57195f908711',
  url: 'http://106.2.20.184:8081',  // server address
  debug: false
});

// 注册Swiper
Vue.use(VueAwesomeSwiper)

// 注册MintUi
Vue.use(MintUI, {
  lazyload: {
    // error: `${constants.prototype.imgBase}dj_moren_logo.png`,
    loading: `${constants.prototype.imgBase}dj_moren_logo.png`
  }
});

// 注册axios
Vue.prototype.$axios = axios;
// 注册echarts
Vue.prototype.$echarts = echarts;
// 注册jquery
Vue.prototype.$ = jQuery;
// 注册constants
Object.keys(constants.prototype).forEach(constantName => {
  Vue.prototype[constantName] = constants.prototype[constantName];
});
// 注册common方法
Object.keys(common).forEach(funcName => {
  Vue.prototype[funcName] = common[funcName];
});
// 注册common组件
Object.keys(components).forEach(componentName => {
  Vue.component(componentName, components[componentName]);
});
// 注册指令
Object.keys(directives).forEach(directiveName => {
  Vue.directive(directiveName, directives[directiveName]);
});

new Vue({
  el: '#app',
  store,
  i18n,
  render: h => h(App),
  router
});
