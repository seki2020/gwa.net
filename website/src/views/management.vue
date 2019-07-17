<template>
  <div>
    <div class="section">
      <div class="container is-fullhd">
        <h1 class="title">This is the management page</h1>
      </div>
    </div>

    <div class="section">
      <div class="container is-fullhd">
        <div class="columns">
          <div class="column is-one-quarter">
            <aside class="menu">
              <p class="menu-label">
                General
              </p>
              <ul class="menu-list">
                <li><router-link to="/management/users">Users</router-link></li>
                <li><router-link to="/management/trips">Trips</router-link></li>
              </ul>
              <p class="menu-label">
                Administration
              </p>
              <ul class="menu-list">
                <li><router-link to="/management/flags">Flags</router-link></li>
              </ul>
            </aside>

          </div>
          <div class="column">
            <router-view/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'management',
  components: {
  }
}

</script>
