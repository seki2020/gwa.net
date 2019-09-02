<template>
   <section class="section">
     <div class="container">
       <h1 class="title has-text-centered">The story of Going Walkabout</h1>
       <p class="content has-text-centered">{{ _('One day a week I work on Going Walkabout, a mobile travel diary. I love to travel and go to new places, part of traveling is sharing experiences and capturing memories. None of the existing solutions fulfill my needs and now it\'s time to do something about it. I document the progress on YouTube, you see me making functional and technical decisions, implement and test the functionality. It gives you insights in what needs to be done when creating an app.')}}</p>
       <p class="content"></p>
     </div>
     <div class="container is-fullhd">
      <div class="columns">
        <div v-for="(video, index) in videos" :key="video.id" class="column" :data-aos="zooms[index]" data-aos-once="true">
          <div class="card">
            <div class=card-image>
              <figure class="image is-16by9">
                <a :href="'https://www.youtube.com/watch?v=' + video.content.key" target="_blank">
                  <img :src="'https://img.youtube.com/vi/' + video.content.key + '/mqdefault.jpg'" :alt="video.content.title">
                </a>
              </figure>
            </div>
            <div class="card-content">
              <p class="content">{{video.content.title}}</p>
              <div class="level">
                <div class="level-left">
                  <div class="level-item has-text-grey is-size-7">{{video.content.date | formatDate}}</div>
                </div>
                <div class="level-right">
                  <div class="level-item"><a :href="'https://www.youtube.com/watch?v=' + video.content.key" target="_blank"><i class="fab fa-2x fa-youtube"></i></a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="content has-text-centered"><a class="button is-primary" href="https://www.youtube.com/channel/UCK1zKCoLY61Xb9UgGyjGarQ?sub_confirmation=1" target="_blank"><strong>{{ _('Subscribe')}}</strong></a></p>
      <p class="content has-text-centered"><router-link to="/goingwalkabout">{{ _('See all of Going Walkabout')}}</router-link></p>
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
    Storyblok.get(`cdn/stories`, {
      version: 'draft',
      starts_with: locale + 'videos/',
      per_page: 4,
      sort_by: 'content.date:desc'
    }).then(response => {
      this.videos = response.data.stories
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>
