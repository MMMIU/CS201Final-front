<template>
  <div id="backgroundCircles">
    <!--    <el-button @click="createCircle">啦啦啦</el-button>-->
    <!--    <el-button @click="stopCircle">STOP</el-button>-->
  </div>
</template>

<script>
export default {
  name: 'BackgroundCircles',
  data () {
    return {
      width: 0,
      height: 0,
      clearAllInterval: false,
      numCircles: 30,
      refreshTime: 25,
      maxMoveSpeedX: 3,
      minMoveSpeedX: 1,
      maxMoveSpeedY: 3,
      minMoveSpeedY: 1,
      moveRate: 1,
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight
    }
  },
  mounted () {
    for (let i = 0; i < this.numCircles; i++) {
      this.createCircle()
    }
  },
  created () {
    window.addEventListener('resize', () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
        this.screenHeight = document.body.clientHeight
      })()
    })
  },
  methods: {
    createCircle () {
      let circle = document.createElement('div')
      // let circleSize = Math.round(this.screenWidth * 0.2 + Math.random() * this.screenWidth * 0.1)
      let circleSize = Math.round(this.screenWidth * 0.25)
      let circlePosX = Math.round(Math.random() * (this.screenWidth - circleSize))
      let circlePosY = Math.round(Math.random() * (this.screenHeight - circleSize))
      let circleStyle = circle.style
      circleStyle.borderRadius = '50%'
      circleStyle.position = 'absolute'
      circleStyle.width = circleSize + 'px'
      circleStyle.height = circleSize + 'px'
      circleStyle.backgroundColor = this.getColor(circlePosX, circlePosY)
      circleStyle.left = circlePosX + 'px'
      circleStyle.top = circlePosY + 'px'
      document.getElementById('backgroundCircles').appendChild(circle)
      let speedX = Math.round((Math.random() > 0.5 ? 1 : -1) *
        ((Math.random() - 0.5) * (this.maxMoveSpeedX - this.minMoveSpeedX) + this.minMoveSpeedX))
      let speedY = Math.round((Math.random() > 0.5 ? 1 : -1) *
        ((Math.random() - 0.5) * (this.maxMoveSpeedY - this.minMoveSpeedY) + this.minMoveSpeedY))
      if (speedX === 0)speedX = (Math.random() > 0.5 ? 1 : -1) * this.minMoveSpeedX
      if (speedY === 0)speedY = (Math.random() > 0.5 ? 1 : -1) * this.minMoveSpeedY
      let moveCount = 0
      setInterval(() => {
        circleSize = Math.round(this.screenWidth * 0.25)
        circleStyle.width = circleSize + 'px'
        circleStyle.height = circleSize + 'px'
        if (circlePosX <= 0) {
          speedX = Math.abs(speedX)
        } else if (circlePosX + speedX >= (this.screenWidth - circleSize)) {
          circlePosX = this.screenWidth - circleSize
          speedX = -Math.abs(speedX)
        }
        if (circlePosY <= 0) {
          speedY = Math.abs(speedY)
        } else if (circlePosY + speedY >= (this.screenHeight - circleSize)) {
          circlePosY = this.screenHeight - circleSize
          speedY = -Math.abs(speedY)
        }
        circleStyle.backgroundColor = this.getColor(circlePosX, circlePosY)
        if (moveCount >= this.moveRate) {
          moveCount = 0
          circlePosX += speedX
          circlePosY += speedY
          circleStyle.left = circlePosX + 'px'
          circleStyle.top = circlePosY + 'px'
        }
        moveCount++
      }, this.refreshTime)
    },
    getColor (circlePosX, circlePosY) {
      const r = 0
      const g = 50 + Math.round((circlePosX / (this.screenWidth - circlePosX)) * 255 / 2)
      const b = 50 + Math.round((circlePosY / (this.screenHeight - circlePosY)) * 255 / 2)
      const color = `rgba(${r},${g},${b})`
      return color
    },
    stopCircle () {
      this.clearAllInterval = !this.clearAllInterval
    }
  }
}
</script>

<style scoped>
#backgroundCircles {
  z-index: 0;
  width: 100%;
  height: 100%;
  position: fixed;
}
</style>
