<template>
  <div>
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>{{_('Created')}}</th>
          <th>{{_('Name')}}</th>
          <th>{{_('Featured')}}</th>
          <th>{{_('Privacy')}}</th>
          <th>{{_('Followers')}}</th>
          <th>{{_('Posts')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trip in trips" :key="trip.id">
          <td>{{trip.created | formatDate}}</td>
          <td>{{trip.name}}</td>
          <td>{{trip.featured}}</td>
          <td>{{trip.privacy}}</td>
          <td>{{trip.followers}}</td>
          <td>{{trip.posts}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import { translate as _ } from '@/system/translator'
import api from '../../system/api'

export default {
  name: 'trips',
  data () {
    return {
      trips: []
    }
  },
  async created () {
    api.get('/web/management/trips')
      .then(response => {
        this.trips = response.data.trips
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
