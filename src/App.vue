<template>
  <div id="app">
    <background-music></background-music>
<!--    <circles v-if="showCircles"></circles>-->
    <router-view/>

  </div>
</template>

<script>
import circles from './components/background/backgroundCircles'
import backgroundMusic from './components/background/backgroundMusic'
export default {
  name: 'App',
  data () {
    return {
      screenWidth: document.body.clientWidth,
      showCircles: this.screenWidth > this.MOBILE
    }
  },
  components: {circles, backgroundMusic},
  created () {
    window.addEventListener('resize', () => {
      this.screenWidth = document.body.clientWidth
      this.showCircles = (this.screenWidth > this.MOBILE)
    })
  },
  mounted () {
    this.showCircles = this.screenWidth > this.MOBILE
  },
  watch: {
    // '$route.path' (val) {
    //   this.useCircles = (val !== '/login')
    // },
    screenWidth (val) {
      this.screenWidth = val
      this.showCircles = val > this.MOBILE
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
  /*background-color: rgb(255,245,247);*/
  background-image: url("/static/backgrounds/stardust.jpg");
  background-position: center;
  background-size: cover;
  min-height: 40rem;
}
</style>
