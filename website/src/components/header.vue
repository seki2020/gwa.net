<template>
  <header>
    <nav class="navbar is-primary is-fixed-top">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item brand-icon"></router-link>
      </div>
      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <router-link v-if="!isAuthenticated" to="/login" class="button is-primary">{{ _('Sign in') }}</router-link>
              <a v-if="isAuthenticated" @click.prevent="logOut" class="button is-primary">{{ _('Sign out') }}</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'x-header',
  computed: {
    isAuthenticated () {
      return this.$store.state.authenticated
    }
  },
  methods: {
    logOut () {
      firebase.auth().signOut()
    }
  }
}
</script>

<style scoped>
</style>
