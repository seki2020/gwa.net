<template>
  <div>
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>{{_('Created')}}</th>
          <th>{{_('Name')}}</th>
          <th>{{_('Public')}}</th>
          <th>{{_('Featured')}}</th>
          <th>{{_('Followers')}}</th>
          <th>{{_('Posts')}}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trip in trips" :key="trip.id">
          <td>{{trip.created | formatDate}}</td>
          <td>{{trip.name}}</td>
          <td><i v-if="trip.shared" class="fas fa-check"></i></td>
          <td><i v-if="trip.featured" class="fas fa-check"></i></td>
          <td>{{trip.followers}}</td>
          <td>{{trip.posts}}</td>
          <td>
            <div class="dropdown is-hoverable is-right">
              <div class="dropdown-trigger">
                <i class="fas fa-cog" area-haspopup="true" area-controls="dropdown-menu"></i>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a href="#" class="dropdown-item" @click="updateRecent(trip.id)">
                    Update recent
                  </a>
                  <a href="#" class="dropdown-item" @click="updateFollowers(trip.id)">
                    Update followers
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
  },
  methods: {
    updateRecent (tripId) {
      console.log(`Update recent: ${tripId}`)

      const url = `/web/management/trips/${tripId}/recent`
      api.post(url)
        .then(response => {
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateFollowers (tripId) {
      console.log(`Update followers: ${tripId}`)
    }
  }
}
</script>
