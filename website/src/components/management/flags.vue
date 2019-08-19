<template>
  <div>
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>{{_('Date')}}</th>
          <th>{{_('Type')}}</th>
          <th>{{_('User')}}</th>
          <th>{{_('Trip')}}</th>
          <th>{{_('Post')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="flag in flags" :key="flag.id">
          <td>{{flag.created | formatDate}}</td>
          <td>{{getTypeName(flag.type)}}</td>
          <td>{{flag.user.name}}</td>
          <td>{{flag.trip.name}}</td>
          <td><span v-if="flag.post">{{flag.post.name}}</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import { translate as _ } from '@/system/translator'

export default {
  name: 'flags',
  data () {
    return {
      message: 'hello',
      flags: []
    }
  },
  async created () {
    console.log('do stuff')
    axios.get('/web/management/flags')
      .then(response => {
        console.log(response)
        this.flags = response.data.flags
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    getTypeName (type) {
      if (type === 10) {
        return _('Inappropriate')
      } else if (type === 20) {
        return _('Abusive or Harmful')
      } else if (type === 30) {
        return _('Spam')
      } else if (type === 40) {
        return _('Copyright Infringement')
      }
      return _('Unknown')
    }
  }

}
</script>
