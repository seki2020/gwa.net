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
                    <input type="email" name="email" class="input is-medium" :class="{'is-danger': errors.has('email') }" :placeholder="_('Email')" v-model.lazy="email" v-validate="'required|email'" >
                    <span class="icon is-left">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <span v-show="fields.email && fields.email.valid" class="icon is-right" >
                      <i class="fas fa-check"></i>
                    </span>
                  </div>
                </div>
                <div class="field">
                  <div class="control has-icons-left has-icons-right">
                    <input type="password" name="password" class="input is-medium" :class="{'is-danger': errors.has('password') }" placeholder="Password" v-model="password" v-validate="'required|min:6'">
                    <span class="icon is-left">
                      <i class="fas fa-unlock-alt"></i>
                    </span>
                    <span v-show="fields.password && fields.password.valid" class="icon is-right" >
                      <i class="fas fa-check"></i>
                    </span>
                  </div>
                </div>
                <div class="field">
                  <div class="message is-danger" v-if="hasErrors">
                    <div class="message-body is-size-7">
                      {{errorMessage}}
                    </div>
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

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      message: ''
    }
  },
  computed: {
    hasErrors () {
      var errors = this.$validator.errors
      return errors.has('email') || errors.has('password') || this.message
    },
    errorMessage () {
      var errors = this.$validator.errors
      if (errors.has('email')) {
        return errors.first('email')
      } else if (errors.has('password')) {
        return errors.first('password')
      } else if (this.message) {
        return this.message
      }
      return ''
    }
  },

  methods: {
    login () {
      console.log('Login: Go')
      this.message = ''

      var router = this.$router
      // var store = this.$store

      this.$validator.validate().then(valid => {
        if (valid) {
          console.log(' - Got valid form')
          firebase.auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              user => {
                console.log('Login: Got a user')
                router.replace('/management')
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
                console.log(' Error: ' + this.message)
              }
            )
        }
      })
    }
  }
}
</script>
