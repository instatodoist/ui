import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import Default from './layouts/default.vue';
import LoginLayout from './layouts/login.vue';

Vue.config.productionTip = false;
Vue.prototype.$BASE_URL = process.env.VUE_APP_BASE_URL;
Vue.prototype.$APP_TITLE = 'Instant-Todos';
Vue.component('default-layout', Default);
Vue.component('login-layout', LoginLayout);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
