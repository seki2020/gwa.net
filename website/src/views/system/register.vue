<template>
  <div>
    <div style="margin: 0 auto; width: 320px;">
      <div class="box">
        <h3 class="title has-text-grey">Register</h3>
        <form>
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input type="text" name="name" class="input is-medium" :class="{'is-danger': errors.has('name') }" placeholder="Name" v-model="name" v-validate="'required'">
              <span class="icon is-left">
                <i class="fa fa-user"></i>
              </span>
              <span v-show="errors.has('name')" class="icon is-right" >
                <i class="fa fa-warning"></i>
              </span>
              <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
            </p>
          </div>
          <div class="field">
            <div class="control has-icons-left has-icons-right">
              <input type="email" name="email" class="input is-medium" :class="{'is-danger': errors.has('email') }" placeholder="Email" v-model.lazy="email" v-validate="'required|email'" >
              <span class="icon is-left">
                <i class="fa fa-envelope"></i>
              </span>
              <span v-show="errors.has('email')" class="icon is-right" >
                <i class="fa fa-warning"></i>
              </span>
              <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left has-icons-right">
              <input type="password" name="password" class="input is-medium" placeholder="Password" v-model="password" v-validate="'required'">
              <span class="icon is-left">
                <i class="fa fa-unlock-alt"></i>
              </span>
              <span v-show="errors.has('password')" class="icon is-right" >
                <i class="fa fa-warning"></i>
              </span>
              <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
            </div>
          </div>
          <a class="button is-block is-info is-medium" :disabled="errors.any() || !isComplete" v-on:click="register">Register with email</a>
          <div style="margin-top: 10px;">Already have an account? <router-link to="/login">Log in</router-link></div>

        </form>
        <!-- separator -->
        <!-- Google button -->
      </div>
    </div>
  </div>

</template>

<script>
import firebase from "firebase/app";
import api from '../../system/api'

export default {
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      message: ""
    };
  },
  computed: {
    isComplete () {
      return this.name && this.password && this.email;
    },
    hasErrors: function() {
      var errors = this.$validator.errors
      return errors.has('name') || errors.has('email') || errors.has('password') || this.message
    },
    errorMessage: function() {
      var errors = this.$validator.errors
      if (errors.has('name')) {
        return errors.first('name')
      }
      else if (errors.has('email')) {
        return errors.first('email')
      }
      else if (errors.has('password')) {
        return errors.first('password')
      }
      else if (this.message) {
        return this.message
      }
    }
  },
  methods: {
    register: function() {
      console.log('Register: Go!')
      this.message = ""

      var router = this.$router
      var store = this.$store

      firebase.auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            console.log("Register: Got a user")

            user.updateProfile({
              displayName: this.name
            }).then(function() {
              console.log("Register: updated the user name")
            }).catch(function(error) {
              // An error happened.
            });

            // Send the user to the backend
            var data = {
              name: this.name,
            }

            user.getIdToken().then(function(idToken) {
              api.post('/api/users/', idToken, data)
                .then(function(data) {
                  console.log('User created')

                  store.dispatch('setUser', user);
                  router.replace('/');
                })
                .catch(function(error) {
                  console.log(error)
                })
            })

          }
        ).catch(function(error) {
          // Handle Errors here.
          this.message = error.message
      })
    }
  }
};
</script>

