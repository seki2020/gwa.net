<template>
  <section class="hero is-large is-primary is-fullheight header-image">
    <div style="padding: 100px 20px;">
      <div class="container">
        <div class="columns">
          <div class="column is-offset-3 is-6" style="padding-bottom: 60px;">
            <div class="box" style="min-height: 200px;">
              <h1 class="title has-text-centered has-text-dark">{{title}}</h1>
              <div v-if="mode == 'resetPassword'" class="content" style="padding: 20px 0 20px;" >
                <div v-if="email">
                  <p>for <strong>{{email}}</strong></p>
                  <form v-on:submit.prevent>
                    <input id="username" style="display:none" type="text" v-model="email" autocomplete="username" >
                    <div class="field">
                      <label class="label">New password</label>
                      <div class="control">
                        <input class="input" type="password" v-model="passwordNew" autocomplete="new-password">
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Confirm password</label>
                      <div class="control">
                        <input class="input" type="password" v-model="passwordConfirm" autocomplete="new-password">
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <button class="button is-primary" :disabled="saveDisabled" @click="savePassword">Save</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div v-if="spinner" class="has-text-centered" style="padding-top: 20px;">
                <i class="fas fa-spinner fa-2x fa-pulse"></i>
              </div>
              <div v-if="success" class="notification is-success">
                {{success}}
              </div>
              <div v-if="error" class="notification is-danger is-loading">
                {{error}}
              </div>
              <div v-if="message" class="notification is-info">
                {{message}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import firebase from 'firebase/app'
import 'firebase/auth'
import { config } from '../secrets/firebase'
import { translate as _ } from '@/system/translator'

const app = firebase.initializeApp(config)
const auth = app.auth()

export default {
  name: 'auth',
  data () {
    return {
      title: null,
      mode: null,
      actionCode: null,
      email: null,
      passwordNew: '',
      passwordConfirm: '',
      success: null,
      error: null,
      message: null,
      spinner: false
    }
  },
  computed: {
    saveDisabled () {
      return !(this.passwordNew.length >= 6 && this.passwordConfirm.length >= 6 && this.passwordNew === this.passwordConfirm)
    }
  },
  methods: {
    savePassword () {
      auth.confirmPasswordReset(this.actionCode, this.passwordNew).then((resp) => {
        // Password reset has been confirmed and new password updated.
        this.email = null
        this.success = _('Your password is changed succesfully.')
      }).catch((error) => {
        // Error occurred during confirmation. The code might have expired or the password is too weak.
        this.error = error
      })
    }
  },
  mounted () {
    let q = this.$route.query
    this.mode = q.mode
    this.actionCode = q.oobCode

    if (this.mode === 'resetPassword') {
      this.title = _('Reset your password')
      // Verify the password reset code is valid.
      auth.verifyPasswordResetCode(this.actionCode).then((email) => {
        this.email = email
      }).catch((error) => {
        // Invalid or expired action code. Ask user to try to reset the password again.
        this.error = error
        this.message = _('Please request a new reset password again')
      })
    } else if (this.mode === 'verifyEmail') {
      this.title = _('Email verification')
      this.spinner = true

      // Try to apply the email verification code.
      auth.applyActionCode(this.actionCode).then((resp) => {
        // Email address has been verified.
        this.success = _('Email is verified')
        this.spinner = false
      }).catch((error) => {
        // Code is invalid or expired. Ask the user to verify their email address again.
        this.error = error
        this.message = _('Please request a new email verification code')
        this.spinner = false
      })
    } else if (this.mode === 'recoverEmail') {
      this.title = _('Email recovery')
      this.spinner = true

      // var restoredEmail = null
      // Confirm the action code is valid.
      auth.checkActionCode(this.actionCode).then((info) => {
        // Get the restored email address.
        // restoredEmail = info['data']['email']

        // Revert to the old email.
        return auth.applyActionCode(this.actionCode)
      }).then(() => {
        // Account email reverted to restoredEmail

        // TODO: Display a confirmation message to the user.
        this.success = _('Email is reverted to original email')
        this.spinner = false

        // You might also want to give the user the option to reset their password
        // in case the account was compromised:
        // auth.sendPasswordResetEmail(restoredEmail).then(() => {
        //   // Password reset confirmation sent. Ask user to check their email.
        // }).catch((error) => {
        //   // Error encountered while sending password reset code.
        // });
      }).catch((error) => {
        // Invalid code.
        this.error = error
        this.spinner = false
      })
    }
  }
}

</script>
