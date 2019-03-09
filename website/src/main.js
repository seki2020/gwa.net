import Vue from 'vue'
import App from './app.vue'
import router from './router'
import { translate as _ } from './system/translator'

Vue.config.productionTip = false
Vue.prototype._ = _

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
