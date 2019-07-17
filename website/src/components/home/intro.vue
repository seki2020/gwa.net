<template>
  <section class="hero is-large is-primary is-fullheight header-image">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title is-size-1">Going Walkabout</h1>
        <h2 class="subtitle">Capture memories, enjoy your travels</h2>
        <router-link to="/login">Login</router-link>&nbsp;&nbsp;<a @click.prevent="logOut">Logout</a>
      </div>
    </div>
    <div>
      <p class="has-text-centered"><i class="fas fa-2x fa-angle-double-down" style="position: relative; bottom: 1em; animation: floating 1.2s infinite;"></i></p>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'intro',
  methods: {
    logOut () {
      firebase.auth().signOut()
      // return false
    }
  }
}
</script>
