<template>
<section class="hero is-large is-primary is-fullheight header-image">
    <div style="padding: 100px 20px;">
      <div class="container">
        <div class="columns">
          <div class="column is-offset-3 is-6" style="padding-bottom: 60px;">
            <div class="box" style="min-height: 200px;">
              <h1 class="title has-text-centered has-text-dark">{{ _('You are invited to follow a Trip')}}</h1>
              <p>{{ _(' you can\'t follow the trip on the web. An iOS app called Going Walkabout is required. Open the link on our iOS device and you will be directed to the correct AppStore page.')}}</p>
              <div class="has-text-centered is-size-7" style="padding-top: 40px;"><router-link to="/" >{{ _('Learn more about Going Walkabout')}}</router-link></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>

export default {
  name: 'links'
}

</script>

<style scoped>

</style>
