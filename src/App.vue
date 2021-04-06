<template>
  <div id="app">
    <circles v-if="showCircles"></circles>
    <router-view/>
  </div>
</template>

<script>
import circles from '../src/components/backgroundAnimation/backgroundCircles'
export default {
  name: 'App',
  data () {
    return {
      screenWidth: document.body.clientWidth,
      showCircles: this.screenWidth > 768
    }
  },
  components: {circles},
  created () {
    window.addEventListener('resize', () => {
      this.screenWidth = document.body.clientWidth
      this.showCircles = (this.screenWidth > 768)
    })
  },
  mounted () {
    // this.useCircles = this.$route.path !== '/login'
  },
  watch: {
    '$route.path' (val) {
      // this.useCircles = (val !== '/login')
    },
    screenWidth (val) {
      this.screenWidth = val
      this.showCircles = val > 768
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
  user-select: none;
  background-color: rgb(255,245,247);
}
</style>
