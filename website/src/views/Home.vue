<template>
  <div>
    <intro></intro>
    <goingwalkabout></goingwalkabout>
    <x-footer></x-footer>
  </div>
</template>

<script>
import Intro from '@/components/home/intro'
import GoingWalkabout from '@/components/home/goingwalkabout'
import XFooter from '@/components/footer'

export default {
  name: 'home',
  components: {
    'intro': Intro,
    'goingwalkabout': GoingWalkabout,
    'x-footer': XFooter
  }
}

</script>
