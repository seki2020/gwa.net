<template>
  <div>
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>{{_('Created')}}</th>
          <th>{{_('Name')}}</th>
          <th>{{_('Email')}}</th>
          <th>{{_('Trips')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{user.created | formatDate}}</td>
          <td>{{user.name}}</td>
          <td>{{user.email}}</td>
          <td>{{user.trips}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import { translate as _ } from '@/system/translator'
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
  }
}
</script>
