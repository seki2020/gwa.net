<template>
  <main id="app">
    <router-view/>
    <x-footer></x-footer>
  </main>
</template>

<script>
import XFooter from '@/components/footer'

export default {
  components: {
    'x-footer': XFooter
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Nunito:400,700");
</style>
