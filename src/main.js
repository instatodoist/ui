import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;
Vue.prototype.$BASE_URL = process.env.VUE_APP_BASE_URL;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
