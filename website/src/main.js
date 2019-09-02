import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'

import Validate from 'vee-validate'

import firebase from 'firebase/app'
import 'firebase/auth'
import { result } from './secrets/firebase-config.json'

import 'cookieconsent'

import Formatting from './system/formatting'
import { translate as _ } from './system/translator'

import { jarallax } from 'jarallax'

firebase.initializeApp(result)
// const auth = app.auth()

Vue.config.productionTip = false
Vue.use(Validate)
Vue.use(Formatting)
Vue.prototype._ = _

new Vue({
  store: store,
  router: router,
  created () {
    console.log('App created!')
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(' - App: user: ' + user.uid + ', ' + user.displayName)
        this.$store.commit('authenticate')
        // this.$store.dispatch('setUser', user)
      } else {
        console.log(' - App: NO User')
        this.$store.commit('deauthenticate')
        // this.$store.dispatch('setUser', null)
      }
    })
  },
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

jarallax(document.querySelectorAll('.jarallax'), {
  speed: 0.6
})
