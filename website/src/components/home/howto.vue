<template>
   <section class="section">
     <div class="container">
       <h1 class="title has-text-centered">{{ _('How to')}}...</h1>
       <p class="content has-text-centered">{{ _('A collection of short videos to help you to get the most out of Going Walkabout.')}}</p>
       <p class="content"></p>
     </div>
     <div class="container is-fullhd">
      <div class="columns">
        <div v-for="(video, index) in videos" :key="video.id" class="column" :data-aos="zooms[index]" data-aos-once="true">
          <div class="card">
            <div class="media">
              <div class="media-left">
                <figure class="image">
                  <a :href="'https://www.youtube.com/watch?v=' + video.content.key" target="_blank">
                    <img :src="'https://img.youtube.com/vi/' + video.content.key + '/mqdefault.jpg'" :alt="video.content.title" style="width: 180px; border: 1px solid white;">
                  </a>
                </figure>
              </div>
              <div class="media-content">
                <div class="has-text-weight-semibold" style="margin-top: 20px">{{video.content.title}}</div>
                  <div><a :href="'https://www.youtube.com/watch?v=' + video.content.key" target="_blank"><i class="fab fa-2x fa-youtube"></i></a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="content has-text-centered has-text-weight-semibold"><router-link to="/howto">{{ _('See all how to videos')}}</router-link></p>
     </div>
  </section>
</template>

<script>
import { getLocale } from '@/system/locale'
import Config from '@/secrets/config'
import StoryblokClient from 'storyblok-js-client'

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
  name: 'gwa',
  data () {
    return {
      videos: [],
      zooms: ['zoom-in-right', 'zoom-in-up', 'zoom-in-down', 'zoom-in-left']
    }
  },
  created () {
    Storyblok.get('cdn/stories', {
      version: 'draft',
      starts_with: locale + 'how-to/',
      per_page: 3,
      sort_by: 'content.date:asc'
    }).then(response => {
      this.videos = response.data.stories
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>
