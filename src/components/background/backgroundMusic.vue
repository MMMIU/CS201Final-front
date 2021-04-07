<template>
  <div class="musicPanel">
    <audio id="music" src="static/media/music/JABBERLOOP - ソレソレ.mp3" autoplay></audio>
    <div id="playIcon" class="el-icon-video-play" @click="playPause"></div>
  </div>
</template>

<script>
export default {
  name: 'backgroundMusic',
  data () {
    return {
      musicPlaying: false
    }
  },
  mounted () {
    this.musicPlaying = !document.getElementById('music').paused
    if (document.getElementById('music')) {
      document.getElementById('music').volume = 0.3
    }
  },
  methods: {
    playPause () {
      if (this.musicPlaying) {
        document.getElementById('music').pause()
        document.getElementById('playIcon').className = 'el-icon-video-play'
        this.musicPlaying = false
      } else {
        document.getElementById('music').play()
        document.getElementById('playIcon').className = 'el-icon-video-pause'
        this.musicPlaying = true
      }
    }
  }
}
</script>

<style scoped>
.musicPanel{
  width: 30px;
  height: 30px;
  position: fixed;
  top: 0;
  right: 0;
  font-size: 30px;
  z-index: 99999;
}
#playIcon{
  cursor: pointer;
}
</style>
