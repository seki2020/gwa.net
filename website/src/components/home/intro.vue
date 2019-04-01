<template>
  <section class="hero is-large is-primary is-fullheight header-image">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title is-size-1">Going Walkabout</h1>
        <h2 class="subtitle">Capture memories, enjoy your travels</h2>
      </div>
    </div>
    <div>
      <p class="has-text-centered"><i class="fas fa-2x fa-angle-double-down" style="position: relative; bottom: 1em; animation: floating 1.2s infinite;"></i></p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'intro'
}
</script>

<style scoped>
.header-image {
    background-image: url("../../assets/header-small-compressed-bg.jpg");
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-color: #999;
}
</style>
