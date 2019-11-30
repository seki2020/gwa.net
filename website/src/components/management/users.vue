<template>
  <div>
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>{{_('Created')}}</th>
          <th>{{_('Name')}}</th>
          <th>{{_('Email')}}</th>
          <th>{{_('Trips')}}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{user.created | formatDate}}</td>
          <td>{{user.name}}</td>
          <td>{{user.email}}</td>
          <td>{{user.trips}}</td>
          <td>
            <div class="dropdown is-hoverable is-right">
              <div class="dropdown-trigger">
                <i class="fas fa-cog" area-haspopup="true" area-controls="dropdown-menu"></i>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a href="#" class="dropdown-item" @click="updateTrips(user.id)">
                    {{_('Update trips')}}
                  </a>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '../../system/api'

export default {
  name: 'users',
  data () {
    return {
      users: []
    }
  },
  async created () {
    api.get('/web/management/users')
      .then(response => {
        this.users = response.data.users
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    updateTrips (userId) {
      const url = `/web/management/users/${userId}/trips`
      api.post(url)
        .then(response => {
          if (response.data.trips) {
            this.users.forEach(element => {
              if (element.id === userId) {
                element.trips = response.data.trips
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

}
</script>
