<template>
  <div>
    <x-header></x-header>

    <div class="section" style="padding-top:60px; padding-bottom:0px;">
      <div class="container is-fullhd">
        <h1 class="title">{{ _('Management')}}</h1>
      </div>
    </div>
    <div class="section" v-if="isAuthenticated">
      <management-container></management-container>
    </div>
  </div>
</template>

<script>
import XHeader from '@/components/header'
import ManagementContainer from '@/components/management/container'

export default {
  name: 'management',
  components: {
    'x-header': XHeader,
    'management-container': ManagementContainer
  },
  computed: {
    isAuthenticated () {
      return this.$store.state.authenticated
    }
  }
}
</script>
