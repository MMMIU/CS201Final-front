<template>
  <div id="app">
<!--    <background-music></background-music>-->
    <background-stars></background-stars>
    <router-view/>
  </div>
</template>

<script>
import backgroundMusic from './components/background/backgroundMusic'
import backgroundStars from './components/background/backgroundStars'
export default {
  name: 'App',
  data () {
    return {
      screenWidth: document.body.clientWidth,
      showCircles: this.screenWidth > this.MOBILE
    }
  },
  components: {backgroundStars, backgroundMusic},
  created () {
    window.addEventListener('resize', () => {
      this.screenWidth = document.body.clientWidth
      this.showCircles = (this.screenWidth > this.MOBILE)
    })
  },
  mounted () {
    this.showCircles = this.screenWidth > this.MOBILE
    window.onpopstate = () => {
      console.log(this.$store.state.allowBack)
      if (!this.$store.state.allowBack) {
        history.go(1)
      }
    }
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
  min-height: 40rem;
  user-select: none;
}
</style>
