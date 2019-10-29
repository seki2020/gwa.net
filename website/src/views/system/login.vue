<template>
  <section class="hero is-large is-primary is-fullheight header-image">
    <div style="padding: 150px 20px;">
      <div class="container">
        <div class="columns">
          <div class="column is-offset-3 is-6" style="padding-bottom: 60px;">
            <div class="box">
              <h3 class="title has-text-centered has-text-grey">{{ _("Login")}}</h3>
              <validation-observer ref="observer" v-slot="{ valid }">
                <form>
                  <div class="field">
                    <div class="control has-icons-left has-icons-right">
                      <validation-provider :name="_('Email')" rules="required|email" v-slot="{ valid }">
                        <input type="email" name="email" class="input is-medium"  :placeholder="_('Email')" v-model.lazy="email"  >
                        <span class="icon is-left">
                          <i class="fas fa-envelope"></i>
                        </span>
                        <span v-show="valid" class="icon is-right" >
                          <i class="fas fa-check"></i>
                        </span>
                      </validation-provider>
                    </div>
                  </div>
                  <div class="field">
                    <div class="control has-icons-left has-icons-right">
                      <validation-provider :name="_('Password')" rules="required|min:6" v-slot="{ valid }">
                        <input type="password" name="password" class="input is-medium"  :placeholder="_('Password')" v-model="password" >
                        <span class="icon is-left">
                          <i class="fas fa-unlock-alt"></i>
                        </span>
                        <span v-show="valid" class="icon is-right" >
                          <i class="fas fa-check"></i>
                        </span>
                      </validation-provider>
                    </div>
                  </div>
                  <div class="field">
                    <div class="message is-danger" v-if="message.length > 0">
                      <div class="message-body is-size-7">
                        {{message}}
                      </div>
                    </div>
                  </div>
                  <button class="button is-fullwidth is-info is-medium" :disabled="!valid" v-on:click.prevent="login">login with email</button>
                  <div class="has-text-centered" style="margin-top: 20px;">Don't have an account? <router-link to="/register">Register</router-link></div>
                </form>
              </validation-observer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, email, min } from 'vee-validate/dist/rules'

extend('required', required)
extend('email', email)
extend('min', min)

export default {
  name: 'login',
  components: {
    'validation-observer': ValidationObserver,
    'validation-provider': ValidationProvider
  },
  data () {
    return {
      email: '',
      password: '',
      message: ''
    }
  },
  methods: {
    async login () {
      this.message = ''

      var router = this.$router

      let valid = await this.$refs.observer.validate()
      if (valid) {
        console.log(' - Got valid form')
        firebase.auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
            console.log('Login: Got a user')
            router.replace('/management')
          })
          .catch(error => {
            this.message = error.message
            console.log(' Error: ' + this.message)
          })
      }
    }
  }
}
</script>
