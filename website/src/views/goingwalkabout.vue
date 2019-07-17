<template>
  <div>
    <section class="section">
      <h1 class="title has-text-centered">Going Walkabout</h1>
      <div class="container">
        <div v-for="row in grid" :key="row.key" class="columns">
          <div v-for="(column, index) in row.columns" :key="column.content.key" class="column is-half" :data-aos="index === 0 ? 'fade-right': 'fade-left'" data-aos-once="true">
            <div class="card">
              <div class="card-header">
                <div class="card-header-title">
                  {{column.content.title}}
                </div>
              </div>
              <div class="card-image">
                <div class="video-responsive">
                  <iframe width="560" height="315" :src="'https://www.youtube-nocookie.com/embed/' + column.content.key" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <x-footer></x-footer>
  </div>
</template>

<script>
import { getLocale } from '@/system/locale'
import Config from '@/secrets/config'
import StoryblokClient from 'storyblok-js-client'
import XFooter from '@/components/footer'

// init with access token
const Storyblok = new StoryblokClient({
  accessToken: Config.Storyblok.token,
  cache: {
    clear: 'auto',
    type: 'memory'
  }
})

var language = getLocale()
const locale = language !== 'en' ? language + '/' : ''

export default {
  name: 'goingwalkabout',
  components: {
    'x-footer': XFooter
  },
  data () {
    return {
      videos: [],
      grid: []
    }
  },
  created () {
    Storyblok.get(`cdn/stories`, {
      version: 'draft',
      starts_with: locale + 'videos/',
      sort_by: 'content.date:asc'
    }).then(response => {
      this.videos = response.data.stories

      // Process in grid format
      const cols = 2
      var row = 0
      var rows = []
      var columns = []
      this.videos.forEach(video => {
        if (columns.length === cols) {
          rows.push({ row: row, columns: columns })
          columns = []
          row += 1
        }
        columns.push(video)
      })
      if (columns.length > 0) {
        rows.push({ row: row, columns: columns })
      }
      this.grid = rows
    }).catch(error => {
      console.log(error)
    })
  }
}

</script>

<style scoped>

</style>
