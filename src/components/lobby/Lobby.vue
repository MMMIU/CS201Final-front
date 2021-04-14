<template>
<div class="lobby"
     v-loading="loading"
     :element-loading-text="loadingText"
     element-loading-background="rgba(250, 250, 250, 0.8)">
  <div class="welcome">Welcome, {{this.username}}</div>
  <div id="lobbyContainer">
      <el-carousel id="elCarousel"
                   trigger="click"
                   :interval="5000"
                   :type="onMobile?'':'card'"
                   indicator-position="outside"
                   arrow="always"
                   v-on:change="changeIndex"
                   v-if="showCards"
                   ref="carousel"
                   :autoplay="autoPlay"
      >
        <el-carousel-item v-for="(item,index) in optionList" :key="item">
          <h3 @click="goOption(index)">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
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
      loading: false,
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      roomNumber: this.$store.state.roomNumber,
      loadingText: null,
      joinButtonEnabled: false,
      onMobile: (document.body.clientWidth <= this.MOBILE),
      optionList: ['Start', 'Join', 'Profile', 'Create'],
      activeIndex: 0,
      waitingTimer: null,
      showCards: true,
      autoPlay: true
    }
  },
  created () {
    window.addEventListener('resize', () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
        this.screenHeight = document.body.clientHeight
        if (this.screenWidth > this.MOBILE && this.onMobile) {
          this.onMobile = false
          this.reloadCards()
        }
        if (this.screenWidth <= this.MOBILE && !this.onMobile) {
          this.onMobile = true
          this.reloadCards()
        }
      })()
    })
  },
  mounted () {
    this.onMobile = document.body.clientWidth <= this.MOBILE
    this.slideBanner()
  },
  methods: {
    reloadCards () {
      this.showCards = false
      this.$nextTick(() => {
        this.showCards = true
      })
    },
    changeIndex (val) {
      this.activeIndex = val
    },
    goOption (index) {
      if (index !== this.activeIndex) return
      switch (this.optionList[this.activeIndex]) {
        case 'Start':
          this.goGameRoom()
          break
        case 'Join':
          this.openJoinBox()
          break
        case 'Profile':
          this.goProfile()
          break
        case 'Create':
          this.createRoom()
          break
      }
    },
    openJoinBox () {
      this.$prompt('Enter room number:', 'Join a room', {
        confirmButtonText: 'Join!',
        cancelButtonText: 'Cancel'
      }).then(({ value }) => {
        this.roomNumber = value
        this.goGameRoom(this.roomNumber)
      }).catch((e) => {
        if (e) console.log('Join box canceled.')
      })
    },
    goProfile () {
      this.loading = true
      this.loadingText = 'Waiting for profile data...'
      axiosWrapper('/requestprofile', 'post', {type: 'join', token: this.token}).then(data => {
        this.$store.commit('SET_TOTAL_GAMES', data.data.totalGames)
        this.$store.commit('SET_WIN_GAMES', data.data.winGames)
        this.$router.push({name: 'profile'})
        this.$message.success('Assign Success!')
      }).catch(e => {
        if (e) {
          this.$message.error('Failed!')
          this.loading = false
        }
      })
    },
    goGameRoom () {
      this.loading = true
      this.loadingText = 'Waiting for join...'
      axiosWrapper('/requestroom', 'post', {type: 'join', token: this.token, roomNumber: this.roomNumber}).then(data => {
        this.$store.commit('SET_ROOM_NUMBER', data.data.roomNumber)
        this.$store.commit('SET_OPPONENT', data.data.opponent)
        this.$store.commit('SET_QUESTIONS', data.data.questions)
        this.$message.success('Assign Success!')
        this.$router.push({name: 'gameroom'})
      }).catch(e => {
        if (e) {
          this.$message.error('Join Failed!')
          this.loading = false
        }
      })
    },
    createRoom () {
      this.loading = true
      axiosWrapper('/requestroom', 'post', {type: 'create', token: this.token}).then(data => {
        this.$store.commit('SET_ROOM_NUMBER', data.data.roomNumber)
        this.loadingText = 'Your room number is ' + data.data.roomNumber + '. Waiting for another player...'
        this.waitingForPlayer()
      }).catch(e => {
        if (e) {
          this.$message.error('Create Failed!')
          this.loading = false
        }
      })
    },
    waitingForPlayer () {
      this.waitingTimer = setInterval(() => {
        axiosWrapper('/requestroom', 'post', {type: 'create', token: this.token, roomNumber: this.roomNumber}).then(data => {
          if (!data.data.opponent) return
          if (this.$store.state.opponent) return
          clearInterval(this.waitingTimer)
          this.$store.commit('SET_OPPONENT', data.data.opponent)
          this.$store.commit('SET_QUESTIONS', data.data.questions)
          this.$router.push({name: 'gameroom'})
          this.$message.success('Assign Success!')
        })
      }, 100)
    },
    slideBanner () {
      let box = document.querySelector('.el-carousel__container')
      let startPoint = 0
      let stopPoint = 0

      let resetPoint = function () {
        startPoint = 0
        stopPoint = 0
      }

      let that = this
      box.addEventListener('touchstart', function (e) {
        that.autoPlay = false
        startPoint = e.changedTouches[0].pageX
      })

      box.addEventListener('touchmove', function (e) {
        stopPoint = e.changedTouches[0].pageX
      })

      box.addEventListener('touchend', function (e) {
        if (stopPoint === 0 || startPoint - stopPoint === 0) {
          resetPoint()
          return
        }
        if (startPoint - stopPoint > 0) {
          resetPoint()
          that.$refs.carousel.next()
          return
        }
        if (startPoint - stopPoint < 0) {
          resetPoint()
          that.$refs.carousel.prev()
        }
      })
    }
  }

}
</script>

<style scoped>
.lobby {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.welcome{
  width: 80%;
  text-align: center;
  font-size: 3rem;
  color: antiquewhite;
  margin-top: 50px;
}
#lobbyContainer {
  width: 80%;
  height: 40rem;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-carousel{
  width: 80%;
}

.el-carousel__item{
  border-radius: 10px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 5rem;
  opacity: 0.75;
  line-height: 400px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(4n) {
  background-color: #60BEFF;
}

.el-carousel__item:nth-child(4n+1) {
  background-color: #409EFF;
}

.el-carousel__item:nth-child(4n+2) {
  background-color: #42b983;
}
.el-carousel__item:nth-child(4n+3) {
  background-color: #32a973;
}
</style>
