<template>
  <div id="app">
    <background-stars></background-stars>
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import backgroundStars from './components/background/BackgroundStars'

export default {
  name: 'App',
  components: {backgroundStars},
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  mounted () {
    window.onpopstate = () => {
      if (!this.$store.state.allowBack) {
        history.go(1)
      }
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
