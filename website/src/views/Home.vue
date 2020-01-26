<template>
  <div>
    <intro></intro>
    <howto></howto>
    <story></story>
    <x-footer></x-footer>
  </div>
</template>

<script>
import Intro from '@/components/home/intro'
import Story from '@/components/home/story'
import HowTo from '@/components/home/howto'
import XFooter from '@/components/footer'

export default {
  name: 'home',
  components: {
    intro: Intro,
    story: Story,
    howto: HowTo,
    'x-footer': XFooter
  }
}

</script>
