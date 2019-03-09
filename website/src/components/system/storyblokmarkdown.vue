<template>
  <div>
    <div v-html="text"></div>
  </div>
</template>

<script>
import Config from '@/secrets/config'
import StoryblokClient from 'storyblok-js-client'
import marked from 'marked'

// init with access token
const Storyblok = new StoryblokClient({
  accessToken: Config.Storyblok.token,
  cache: {
    clear: 'auto',
    type: 'memory'
  }
})

export default {
  name: 'storyblok-markdown',
  props: {
    slug: String
  },
  data () {
    return {
      text: null
    }
  },
  created () {
    Storyblok.get(`cdn/stories/${this.slug}`, { version: 'draft' })
      .then(response => {
        let story = response.data.story

        this.text = marked(story.content.text, { sanitize: true })
      }).catch(error => {
        console.log(error)
      })
  }
}
</script>
