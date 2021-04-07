<template>
<div id="lobby">
  <div class="welcome">Welcome {{username}} {{token}}</div>
  <div class="mobile" v-if="onMobile">
    <div class="profile align-center-vertical" @click="goProfile">Profile</div>
    <div class="game align-center-vertical" @click="goGameRoom">New Game</div>
    <div class="join align-center-vertical" @click="openJoinBox">Join</div>
  </div>
</div>
</template>

<script>

import {axiosWrapper} from '../../api'

export default {
  name: 'Lobby',
  data () {
    return {
      username: this.$store.state.username,
      token: this.$store.state.token,
      refreshTime: 30,
      timeCirclePopUp: 1,
      maxMoveSpeedX: 3,
      minMoveSpeedX: 3,
      maxMoveSpeedY: 3,
      minMoveSpeedY: 3,
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      circleSizeRatio: 0.3,
      contentCircleSize: 0.9,
      roomNumber: null,
      joinButtonEnabled: false,
      onMobile: (document.body.clientWidth <= this.MOBILE)
    }
  },
  created () {
    window.addEventListener('resize', () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
        this.screenHeight = document.body.clientHeight
        if (this.screenWidth > this.MOBILE && this.onMobile) {
          this.initializeCircles()
          this.onMobile = false
        }
        if (this.screenWidth <= this.MOBILE && !this.onMobile) {
          this.removeCircles()
          this.onMobile = true
        }
      })()
    })
  },
  mounted () {
    this.onMobile = document.body.clientWidth <= this.MOBILE
    if (!this.onMobile) {
      this.initializeCircles()
    }
  },
  methods: {
    initializeCircles () {
      if (!document.getElementById('profileCircle')) {
        let profileCircle = this.createOption('Profile', 0.5, 'antiquewhite')
        profileCircle.addEventListener('click', () => {
          this.goProfile()
        })
      }
      if (!document.getElementById('startCircle')) {
        let newGameCircle = this.createOption('Start', 0.5, 'antiquewhite')
        newGameCircle.addEventListener('click', () => {
          this.goGameRoom()
        })
      }
      if (!document.getElementById('joinCircle')) {
        let joinCircle = this.createOption('Join', 0.5, 'antiquewhite')
        joinCircle.addEventListener('click', () => {
          this.openJoinBox()
        })
      }
    },
    removeCircles () {
      let profileCircle = document.getElementById('profileCircle')
      if (profileCircle) { profileCircle.parentNode.removeChild(profileCircle) }
      let newGameCircle = document.getElementById('startCircle')
      if (newGameCircle) { newGameCircle.parentNode.removeChild(newGameCircle) }
      let joinCircle = document.getElementById('joinCircle')
      if (joinCircle) { joinCircle.parentNode.removeChild(joinCircle) }
    },
    createCircle (text) {
      let circle = document.createElement('div')
      circle.id = text.toLowerCase() + 'Circle'
      let circleSize = Math.floor(this.screenWidth * this.circleSizeRatio)
      let circlePosX = Math.floor(Math.random() * (this.screenWidth - circleSize))
      let circlePosY = Math.floor(Math.random() * (this.screenHeight - circleSize))
      let circleStyle = circle.style
      circleStyle.borderRadius = '50%'
      circleStyle.position = 'absolute'
      circleStyle.width = '0px'
      circleStyle.height = '0px'
      circleStyle.backgroundColor = this.getColor(circlePosX, circlePosY)
      circleStyle.left = circlePosX + circleSize / 2 + 'px'
      circleStyle.top = circlePosY + circleSize / 2 + 'px'
      circleStyle.display = 'flex'
      circleStyle.alignItems = 'center'
      circleStyle.justifyContent = 'center'
      circleStyle.transition = this.timeCirclePopUp + 's'
      circleStyle.cursor = 'pointer'
      circleStyle.overflow = 'hidden'
      document.getElementById('lobby').appendChild(circle)
      let speedX = Math.round((Math.random() > 0.5 ? 1 : -1) *
        ((Math.random() - 0.5) * (this.maxMoveSpeedX - this.minMoveSpeedX) + this.minMoveSpeedX))
      let speedY = Math.round((Math.random() > 0.5 ? 1 : -1) *
        ((Math.random() - 0.5) * (this.maxMoveSpeedY - this.minMoveSpeedY) + this.minMoveSpeedY))
      if (speedX === 0)speedX = (Math.random() > 0.5 ? 1 : -1) * this.minMoveSpeedX
      if (speedY === 0)speedY = (Math.random() > 0.5 ? 1 : -1) * this.minMoveSpeedY
      let paused = false
      // set timer
      setTimeout(() => {
        circleStyle.left = circlePosX + 'px'
        circleStyle.top = circlePosY + 'px'
        circleStyle.width = circleSize + 'px'
        circleStyle.height = circleSize + 'px'
        setTimeout(() => {
          circleStyle.transition = '0s'
          move(this)
        }, this.timeCirclePopUp * 1000)
      }, 1)
      function move (that) {
        setInterval(() => {
          if (!paused) {
            circleSize = Math.round(that.screenWidth * that.circleSizeRatio)
            circleStyle.width = circleSize + 'px'
            circleStyle.height = circleSize + 'px'
            if (circlePosX <= 0) {
              speedX = Math.abs(speedX)
              circlePosX = 0
            } else if (circlePosX + speedX >= (that.screenWidth - circleSize)) {
              circlePosX = that.screenWidth - circleSize
              speedX = -Math.abs(speedX)
            }
            if (circlePosY <= 0) {
              speedY = Math.abs(speedY)
              circlePosY = 0
            } else if (circlePosY + speedY >= (that.screenHeight - circleSize)) {
              circlePosY = that.screenHeight - circleSize
              speedY = -Math.abs(speedY)
            }
            circlePosX += speedX
            circlePosY += speedY
            circleStyle.backgroundColor = that.getColor(circlePosX, circlePosY)
            circleStyle.left = circlePosX + 'px'
            circleStyle.top = circlePosY + 'px'
          }
        }, that.refreshTime)
      }
      function pause () {
        circleStyle.zIndex = '99999'
        paused = true
      }
      function resume () {
        circleStyle.zIndex = '1'
        paused = false
      }
      circle.onmouseenter = () => {
        pause()
      }
      circle.onmouseleave = () => {
        resume()
      }
      return circle
    },
    createOption (text, coefficient, color) {
      let circle = this.createCircle(text)
      let content = document.createElement('div')
      let contentStyle = content.style
      contentStyle.width = this.contentCircleSize * 100 + '%'
      contentStyle.height = this.contentCircleSize * 100 + '%'
      contentStyle.borderRadius = '50%'
      contentStyle.border = '3px solid antiquewhite'
      // contentStyle.wordWrap = 'break-word'
      contentStyle.display = 'flex'
      contentStyle.alignItems = 'center'
      contentStyle.justifyContent = 'center'
      let textBox = document.createElement('div')
      textBox.style.width = '90%'
      content.appendChild(textBox)
      let that = this
      setTimeout(() => {
        contentStyle.lineHeight = this.screenWidth * this.circleSizeRatio * this.contentCircleSize + 'px'
        textBox.innerText = text
        textBox.style.textAlign = 'center'
        textBox.style.color = color
        let scale = this.screenWidth / textBox.offsetWidth * coefficient
        textBox.style.fontSize = scale + 'rem'
        let thisThat = that
        setInterval(() => {
          contentStyle.lineHeight = thisThat.screenWidth * thisThat.circleSizeRatio * thisThat.contentCircleSize + 'px'
        }, thisThat.refreshTime)
      }, this.timeCirclePopUp * 1000 + 1)
      circle.appendChild(content)
      return circle
    },
    getColor (circlePosX, circlePosY) {
      const r = 0
      const g = 50 + Math.round((circlePosX / (this.screenWidth - circlePosX)) * 255 / 2)
      const b = 50 + Math.round((circlePosY / (this.screenHeight - circlePosY)) * 255 / 2)
      return `rgba(${r},${g},${b})`
    },
    openJoinBox () {
      this.$prompt('Enter room number:', 'Join a room', {
        confirmButtonText: 'Join!',
        cancelButtonText: 'Cancel'
      }).then(({ value }) => {
        this.roomNumber = value
        this.goGameRoom(this.roomNumber)
      })
    },
    goProfile () {
      axiosWrapper('/requestprofile', 'post', {token: this.token}).then(data => {
        console.log(data)
        this.$message.success('Assign Success!')
        this.$store.commit('SET_TOTALGAMES', data.data.totalGames)
        this.$store.commit('SET_WINGAMES', data.data.winGames)
        this.$router.push({name: 'profile'})
      }).catch(e => {
        if (e) {
          this.$message.error('Assign Failed!')
        }
      })
    },
    goGameRoom () {
      axiosWrapper('/requestroom', 'post', {token: this.token, roomNumber: this.roomNumber}).then(data => {
        console.log(data)
        this.$store.commit('SET_ROOMNUMBER', data.data.roomNumber)
        this.$message.success('Assign Success!')
        this.$router.push({name: 'gameroom'})
      }).catch(e => {
        if (e) {
          this.$message.error('Assign Failed!')
        }
      })
    }
  }

}
</script>

<style scoped>
#lobby{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.welcome{
  width: 100px;
  height: 20px;
  position: fixed;
  top: 0;
  left: 0;
}
.mobile{
  width: 100%;
  height: 100%;
  cursor: pointer;
  font-size: 2rem;
}
.profile{
  width: 100%;
  height: calc(100% / 3);
  background-color: #42b983;
  transition: 0.3s;
}
.profile:hover{
  color: antiquewhite;
}
.game{
  width: 100%;
  height: calc(100% / 3);
  background-color: #60BEFF;
  transition: 0.3s;
}
.game:hover{
  color: antiquewhite;
}
.join{
  width: 100%;
  height: calc(100% / 3);
  background-color: #409EFF;
  transition: 0.3s;
}
.join:hover{
  color: antiquewhite;
}
.align-center-vertical{
  display: flex;
  align-items: center;
  justify-content: center;
  /*flex-direction: column;*/
}
</style>
