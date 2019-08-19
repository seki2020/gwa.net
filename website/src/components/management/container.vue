<template>
  <div>
    <div class="container is-fullhd" v-if="isAuthorized">
      <div class="columns">
        <div class="column is-one-quarter">
          <aside class="menu">
            <p class="menu-label">
              {{ _('General')}}
            </p>
            <ul class="menu-list">
              <li><router-link to="/management/users">{{ _('Users')}}</router-link></li>
              <li><router-link to="/management/trips">{{ _('Trips')}}</router-link></li>
            </ul>
            <p class="menu-label">
              {{ _('Administration')}}
            </p>
            <ul class="menu-list">
              <li><router-link to="/management/flags">{{ _('Flags')}}</router-link></li>
            </ul>
          </aside>
        </div>
        <div class="column">
          <router-view/>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No permissions</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase/app'

export default {
  name: 'management-container',
  data () {
    return {
      isAuthorized: false
    }
  },
  async created () {
    var user = firebase.auth().currentUser
    if (user) {
      user.getIdToken()
        .then((token) => {
          const options = {
            headers: { 'Authorization': 'Bearer ' + token }
          }
          return axios.get('/web/management/', options)
        })
        .then(response => {
          this.isAuthorized = response.data.permissions
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
