<template>
  <div>
    <intro></intro>
    <goingwalkabout></goingwalkabout>
  </div>
</template>

<script>
import Intro from '@/components/home/intro'
import GoingWalkabout from '@/components/home/goingwalkabout'

export default {
  name: 'home',
  components: {
    'intro': Intro,
    'goingwalkabout': GoingWalkabout
  }
}

</script>
