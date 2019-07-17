<template>
  <section class="hero is-large is-primary is-fullheight header-image">
    <div style="padding: 150px 20px;">
      <div class="container">
        <div class="columns">
          <div class="column is-offset-3 is-6" style="padding-bottom: 60px;">
            <div class="box">
              <h3 class="title has-text-centered has-text-grey">{{ _("Login")}}</h3>
              <form>
                <div class="field">
                  <div class="control has-icons-left has-icons-right">
                    <input type="email" name="email" class="input is-medium" :placeholder="_('Email')" v-model.lazy="email"  >
                    <span class="icon is-left">
                      <i class="fa fa-envelope"></i>
                    </span>
                  </div>
                </div>
                <div class="field">
                  <div class="control has-icons-left has-icons-right">
                    <input type="password" name="password" class="input is-medium" placeholder="Password" v-model="password" >
                    <span class="icon is-left">
                      <i class="fa fa-unlock-alt"></i>
                    </span>
                  </div>
                </div>
                <a class="button is-block is-info is-medium" v-on:click="login">login with email</a>
                <div class="has-text-centered" style="margin-top: 20px;">Don't have an account? <router-link to="/register">Register</router-link></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import validator from '../../system/validator/vue-mixin'

export default {
  name: 'login',
  mixins: [validator],
  data () {
    return {
      email: '',
      password: '',
      message: ''
    }
  },
  validators: {
      'email': {
        required : true,
        minLength: 4,
        custom: function(value) {
            // console.log(" custom validation: firstName")
            return [true, '']
        },
      },
      'password': {
        required: true,
        maxLength: 6,
        custom: function(value) {
            // console.log(" custom validation: lastName")
            return [value === 'Hart', 'Invalid last name']
        }
      }
  },

  methods: {
    login () {
      console.log('Login: Go')
      this.message = ''

      var router = this.$router
      // var store = this.$store

      firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            console.log('Login: Got a user')
            router.replace('/')
            // _user_.verify(user)
            //   .then(function(data) {
            //     console.log('Login: - verify: success')
            //     store.dispatch('setUser', user);
            //     router.replace('/');
            //   })
            //   .catch(function(error) {
            //     console.log('Login: - verify: failure')
            //     t.message = "This user is not registered"

            //     // console.log(error)
            //   })
          },
          error => {
            this.message = error.message
          }
        )
    }
  }
}
</script>
