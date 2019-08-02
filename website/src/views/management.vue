<template>
  <div>
    <x-header></x-header>

    <div class="section" style="padding-top:60px; padding-bottom:0px;">
      <div class="container is-fullhd">
        <h1 class="title">{{ _('Management')}}</h1>
      </div>
    </div>

    <div class="section" v-if="isAuthenticated">
      <div class="container is-fullhd">
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
    </div>
    <div style="height: 600px;">
    </div>
  </div>
</template>

<script>
import XHeader from '@/components/header'

export default {
  name: 'management',
  components: {
    'x-header': XHeader
  },
  computed: {
    isAuthenticated () {
      return this.$store.state.authenticated
    }
  }
}

</script>
