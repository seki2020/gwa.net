import Vue from 'vue'
import App from './app.vue'
import router from './router'
import { translate as _ } from './system/translator'

import 'cookieconsent'

Vue.config.productionTip = false
Vue.prototype._ = _

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname !== '/auth/action') {
    console.log('Do the cookie stuff')
    window.cookieconsent.initialise({
      palette: {
        popup: {
          background: '#ebfeff',
          text: '#00ACB8'
        },
        button: {
          background: '#00ACB8',
          text: '#ffffff'
        }
      },
      position: 'bottom',
      theme: 'classic',
      content: {
        message: _('This website uses cookies to ensure you get the best experience on our website'),
        dismiss: _('Got it!'),
        link: _('Our privacy policy.'),
        href: '/privacy',
        target: '_self'
      }
    })
  }
})
