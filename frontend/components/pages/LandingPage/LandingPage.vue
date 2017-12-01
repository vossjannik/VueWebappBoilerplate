<script>
import connection from '../../../utility/connection'

export default {
  name: 'LandingPage',
  methods: {
    handleClick () {
      connection.send('anytopic', { a: 1, b: 2 })
    },
  },
}
</script>

<template>
  <div class="page">
    landing page content
    <br/>
    <u @click="handleClick">click me</u>
  </div>
</template>

<style lang="sass">
</style>
