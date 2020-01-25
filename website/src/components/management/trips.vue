<template>
  <div>
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>{{_('Created')}}</th>
          <th>{{_('Name')}}</th>
          <th>{{_('User')}}</th>
          <th>{{_('Countries')}}</th>
          <th>{{_('Continents')}}</th>
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
          <td>{{trip.user}}</td>
          <td>
            <span v-for="(c, ix) in trip.countries" :key="c">
              <span>{{c}}</span>
              <span v-if="ix+1 < trip.countries.length">, </span>
            </span>
          </td>
          <td>
            <span v-for="(c, ix) in trip.continents" :key="c">
              <span>{{c}}</span>
              <span v-if="ix+1 < trip.continents.length">, </span>
            </span>
          </td>
          <td><i v-if="trip.shared" class="fas fa-check"></i></td>
          <td><i v-if="trip.featured" class="fas fa-check"></i></td>
          <td class="has-text-right">{{trip.followers}}</td>
          <td class="has-text-right">{{trip.posts}}</td>
          <td>
            <div class="dropdown is-hoverable is-right">
              <div class="dropdown-trigger">
                <i class="fas fa-cog" area-haspopup="true" area-controls="dropdown-menu"></i>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a href="#" class="dropdown-item" @click="updateRecent(trip.id)">
                    {{_('Update recent')}}
                  </a>
                  <a href="#" class="dropdown-item" @click="updateFollowers(trip.id)">
                    {{_('Update followers')}}
                  </a>
                  <a href="#" class="dropdown-item" @click="updatePosts(trip.id)">
                    {{_('Update posts')}}
                  </a>
                  <a href="#" class="dropdown-item" @click="updateContinents(trip.id)">
                    {{_('Update continents')}}
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
      const url = `/web/management/trips/${tripId}/recent`
      api.post(url)
        .then(response => {
          // console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateFollowers (tripId) {
      const url = `/web/management/trips/${tripId}/followers`
      api.post(url)
        .then(response => {
          if (response.data.followers) {
            this.trips.forEach(element => {
              if (element.id === tripId) {
                element.followers = response.data.followers
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    updatePosts (tripId) {
      const url = `/web/management/trips/${tripId}/posts`
      api.post(url)
        .then(response => {
          if (response.data.posts) {
            this.trips.forEach(element => {
              if (element.id === tripId) {
                element.posts = response.data.posts
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateContinents (tripId) {
      console.log('do it')
      const url = `/web/management/trips/${tripId}/continents`
      api.post(url)
        .then(response => {
          if (response.data.continents) {
            console.log(response.data.continents)

            this.trips.forEach(element => {
              console.log(element.id)
              if (element.id === tripId) {
                console.log('yes')
                // element.name = 'foo'
                element.continents = response.data.continents
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
