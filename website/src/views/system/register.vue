<template>
  <div>
    <div style="margin: 0 auto; width: 320px;">
      <div class="box">
        <h3 class="title has-text-grey">Register</h3>
        <form>
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input type="text" name="name" class="input is-medium" placeholder="Name" v-model="name" >
              <span class="icon is-left">
                <i class="fa fa-user"></i>
              </span>
              <span v-show="false" class="icon is-right" >
                <i class="fa fa-warning"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <div class="control has-icons-left has-icons-right">
              <input type="email" name="email" class="input is-medium" placeholder="Email" v-model.lazy="email"  >
              <span class="icon is-left">
                <i class="fa fa-envelope"></i>
              </span>
              <span v-show="false" class="icon is-right" >
                <i class="fa fa-warning"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left has-icons-right">
              <input type="password" name="password" class="input is-medium" placeholder="Password" v-model="password" >
              <span class="icon is-left">
                <i class="fa fa-unlock-alt"></i>
              </span>
              <span v-show="false" class="icon is-right" >
                <i class="fa fa-warning"></i>
              </span>
            </div>
          </div>
          <a class="button is-block is-info is-medium" :disabled="false" v-on:click="register">Register with email</a>
          <div style="margin-top: 10px;">Already have an account? <router-link to="/login">Log in</router-link></div>

        </form>
      </div>
    </div>
  </div>

</template>

<script>
import firebase from 'firebase/app'

export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      message: ''
    }
  },
  computed: {
  },
  methods: {
    register () {
      console.log('Register: Go!')

      this.message = ''

      // var router = this.$router

      firebase.auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log('Register: Got a user')

          user.updateProfile({
            displayName: this.name
          }).then(() => {
            console.log('Register: updated the user name')
          }).catch(error => {
            this.message = error.message
            console.log(error)
          })
        })
        .catch(error => {
          // Handle Errors here.
          this.message = error.message
        })
    }
  }
}
</script>
