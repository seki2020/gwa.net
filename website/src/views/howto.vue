<template>
  <div>
    <section class="section">
      <h1 class="title has-text-centered">Going Walkabout - {{_('How to')}}</h1>
      <div class="container">
        <div v-for="row in grid" :key="row.key" class="columns">
          <div v-for="(column, index) in row.columns" :key="column.content.key" class="column is-half" :data-aos="index === 0 ? 'fade-right': 'fade-left'" data-aos-once="true">
            <div class="card" style="cursor: pointer;" @click="showDialog(column.content.key)">
              <div class="media">
                <div class="media-left">
                  <figure class="image">
                    <img :src="'https://img.youtube.com/vi/' + column.content.key + '/mqdefault.jpg'" :alt="column.content.title" style="width: 180px; border: 1px solid white;">
                  </figure>
                </div>
                <div class="media-content">
                  <div class="has-text-weight-semibold" style="margin-top: 20px">{{column.content.title}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal" :class="{ 'is-active': dialogVisible }">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="video-responsive" v-show="currentVideo">
            <iframe width="560" height="315" :src="'https://www.youtube-nocookie.com/embed/' + currentVideo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="dialogVisible=false; currentVideo=null"></button>
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
      grid: [],
      dialogVisible: false,
      currentVideo: null
    }
  },
  created () {
    Storyblok.get('cdn/stories', {
      version: 'draft',
      starts_with: locale + 'how-to/',
      per_page: 50,
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
  },
  methods: {
    showDialog: function (key) {
      console.log('Show dialog: ', key)
      this.currentVideo = key
      this.dialogVisible = true
    }
  }

}

</script>

<style scoped>

</style>
