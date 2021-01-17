import Vue from 'vue'
import App from './App.vue'
import router from './router'
import status from './status'
import VueLazyload from 'vue-lazyload'

import image_404 from "@/assets/images/404.png"
Vue.use(VueLazyload, {
  loading: image_404,
  error: image_404
});

Vue.config.productionTip = false;

new Vue({
  router,
  data:status,
  render: h => h(App)
}).$mount('#app')
