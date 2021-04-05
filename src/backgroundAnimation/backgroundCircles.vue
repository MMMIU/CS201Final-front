<template>
  <div id="backgroundCircles">
    <el-button @click="createCircle">啦啦啦</el-button>
    <el-button @click="stopCircle">STOP</el-button>
  </div>
</template>

<script>
export default {
  name: 'backgroundCircles',
  data () {
    return {
      width: 0,
      height: 0,
      colors: ['#00ffff', '#409EFF'],
      clearAllInterval: false
    }
  },
  methods: {
    createCircle () {
      let circle = document.createElement('div')
      let circleSize = Math.floor(document.getElementById('backgroundCircles').clientWidth * 0.2 + Math.random() * document.getElementById('backgroundCircles').clientWidth * 0.1)
      let circlePosX = Math.floor(Math.random() * (document.getElementById('backgroundCircles').clientWidth - circleSize))
      let circlePosY = Math.floor(Math.random() * (document.getElementById('backgroundCircles').clientHeight - circleSize))
      let circleStyle = circle.style
      circleStyle.borderRadius = '50%'
      circleStyle.position = 'absolute'
      circleStyle.width = circleSize + 'px'
      circleStyle.height = circleSize + 'px'
      circleStyle.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)]
      circleStyle.left = circlePosX + 'px'
      circleStyle.top = circlePosY + 'px'
      document.getElementById('backgroundCircles').appendChild(circle)
      let speedX = Math.random() > 0.5 ? 1 : -1
      let speedY = Math.random() > 0.5 ? 1 : -1
      let timer = setInterval(() => {
        if (circlePosX <= 0 || circlePosX >= (document.getElementById('backgroundCircles').clientWidth - circleSize)) {
          speedX = -speedX
        }
        if (circlePosY <= 0 || circlePosY >= (document.getElementById('backgroundCircles').clientHeight - circleSize)) {
          speedY = -speedY
        }
        circlePosX += speedX
        circlePosY += speedY
        circleStyle.left = circlePosX + 'px'
        circleStyle.top = circlePosY + 'px'
        if (this.clearAllInterval) {
          clearInterval(timer)
        }
      }, 30)
    },
    stopCircle () {
      this.clearAllInterval = !this.clearAllInterval
    }

  }
}
</script>

<style scoped>
#backgroundCircles{
  width: 100%;
  height: 100%;
  position: fixed;
}
</style>
