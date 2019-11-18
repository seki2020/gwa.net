<template>
  <footer class="footer">
    <div class="columns">
      <div class="column has-text-centered">
        <div class="social-icons" style="margin-bottom: 20px;">
            <a href="https://facebook.com/goingwalkaboutapp">
              <i class="fab fa-lg fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/goingwalkaboutapp/">
              <i class="fab fa-lg fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/goingwalkabout">
              <i class="fab fa-lg fa-youtube"></i>
            </a>
        </div>
        <div>{{_('Handmade with')}} <i class="far fa-heart"></i> {{_('in Delft, The Netherlands')}}</div>
      </div>
      <div class="column has-text-centered">
        <div style="margin-bottom: 20px;">{{ _('Made with') }} <strong><a href="https://bulma.io" target="_blank">Bulma</a></strong> {{ _('and') }} <a href="https://vuejs.org" target="_blank"><strong>Vue</strong></a>, {{ _('hosted on') }} <a href="https://cloud.google.com/appengine/" target="_blank"><strong>Google AppEngine</strong></a></div>
        <div><i class="far fa-copyright"></i> Aadjemonkeyrock {{year}} - <router-link to="/terms">{{ _('Terms') }}</router-link> - <router-link to="/privacy">{{ _('Privacy') }}</router-link></div>
      </div>
    </div>
  </footer>
</template>

<script>

export default {
  name: 'x-footer',
  computed: {
    year () {
      let d = new Date()
      return d.getFullYear()
    }
  }
}
</script>

<style scoped>
</style>
