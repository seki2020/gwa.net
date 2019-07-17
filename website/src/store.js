import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    authenticated: false,
    user: null
  },
  getters: {
    getUser: state => {
      return state.user
    }
  },
  mutations: {
    authenticate (state) {
      state.authenticated = true
    },
    deauthenticate (state) {
      state.authenticated = false
    },
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    setUser (context, user) {
      context.commit('setUser', user)
    }
  }
})

export default store
