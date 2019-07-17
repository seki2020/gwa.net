<template>
  <main>
    <section class="columns">
      <div class="column is-offset-1 is-10">
        <div class="content" style="padding: 1em;">
          <storyblok-markdown slug="about/privacy"></storyblok-markdown>
        </div>
      </div>
    </section>
    <x-footer></x-footer>
  </main>
</template>

<script>
import StoryblokMarkdown from '@/components/system/storyblokmarkdown'
import XFooter from '@/components/footer'

export default {
  name: 'privacy',
  components: {
    'storyblok-markdown': StoryblokMarkdown,
    'x-footer': XFooter
  }
}

</script>
