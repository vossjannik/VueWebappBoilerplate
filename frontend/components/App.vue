<script>
export default {
  name: 'App',
  created () {
    this.$router.afterEach((to, from) => {
      this.$refs['main'].scrollTo(0, 0)
    })
  },
}
</script>

<template>
  <div class="app">
    VueWebappBoilerplate
    <main class="page-container" ref="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<style lang="sass">
</style>
