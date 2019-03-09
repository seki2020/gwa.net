<template>
  <section class="columns">
    <div class="column is-offset-1 is-10">
      <div class="content" style="padding: 1em;">
        <storyblok-markdown slug="about/privacy"></storyblok-markdown>
      </div>
    </div>
  </section>
</template>

<script>
import StoryblokMarkdown from '@/components/system/storyblokmarkdown'

export default {
  name: 'privacy',
  components: {
    'storyblok-markdown': StoryblokMarkdown
  }
}

</script>
