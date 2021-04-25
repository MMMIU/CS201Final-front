<template>
  <div id="app">
<!--    <background-music></background-music>-->
    <background-stars></background-stars>
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import backgroundMusic from './components/background/backgroundMusic'
import backgroundStars from './components/background/BackgroundStars'
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      screenWidth: document.body.clientWidth,
      showCircles: this.screenWidth > this.MOBILE,
      isRouterAlive: true
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
      if (!this.$store.state.allowBack) {
        history.go(1)
      }
    }
  },
  watch: {
    screenWidth (val) {
      this.screenWidth = val
      this.showCircles = val > this.MOBILE
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
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
