<template>
  <div class="lobby"
       v-loading="loading"
       :element-loading-text="loadingText"
       element-loading-background="rgba(250, 250, 250, 0.8)">
    <div class="welcome"><p>Welcome, {{ this.username }}</p>
      <p>Please select a card to begin</p></div>
    <div class="lobbyContainer">
      <el-carousel id="elCarousel"
                   trigger="click"
                   :interval="8000"
                   :type="onMobile?'':'card'"
                   indicator-position="outside"
                   arrow="always"
                   v-on:change="changeIndex"
                   v-if="showCards"
                   ref="carousel"
                   :autoplay="autoPlay"
      >
        <el-carousel-item v-for="(item,index) in optionList" :key="item">
          <h3 @click="goOption(index)">{{ item }}</h3><br>
          <h6 @click="goOption(index)">{{ descriptionList[index] }}</h6>
        </el-carousel-item>
      </el-carousel>
      <el-button type="danger" @click="logOut(false)">Log Out</el-button>
      <div class="logOutCover" v-if="showLogOut">
        <el-button type="danger" @click="logOut(true)">Log Out</el-button>
        <el-button type="plain" @click="showLogOut=false">Cancel</el-button>
      </div>
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
      token: null,
      loading: false,
      roomNumber: -1,
      loadingText: null,
      joinButtonEnabled: false,
      onMobile: (document.body.clientWidth <= this.MOBILE),
      showLogOut: false,
      optionList: ['Start', 'Join', 'About', 'Profile', 'Create'],
      descriptionList: ['start a new game', 'join a room', 'about Us', 'your career', 'create a new room'],
      activeIndex: 0,
      waitingTimer: null,
      showCards: true,
      autoPlay: true
    }
  },
  created () {
    this.token = this.$store.state.token
    window.addEventListener('resize', () => {
      if (document.body.clientWidth > this.MOBILE && this.onMobile) {
        this.onMobile = false
        this.reloadCards()
      }
      if (document.body.clientWidth <= this.MOBILE && !this.onMobile) {
        this.onMobile = true
        this.reloadCards()
      }
    })
  },
  mounted () {
    this.onMobile = document.body.clientWidth <= this.MOBILE
    this.allowSliding()
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
          this.goGameRoom('join')
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
        case 'About':
          this.goAbout()
          break
      }
    },
    openJoinBox () {
      this.$prompt('Enter room number:', 'Join a room', {
        confirmButtonText: 'Join!',
        cancelButtonText: 'Cancel'
      }).then(({value}) => {
        this.roomNumber = value
        this.goGameRoom('join')
      })
    },
    goProfile () {
      this.loading = true
      this.loadingText = 'Waiting for profile data...'
      axiosWrapper('/user/statistics', 'post', {token: this.token}).then(data => {
        if (data.flag) {
          this.$store.commit('SET_TOTAL_GAMES', data.data.gameNumber)
          this.$store.commit('SET_WIN_GAMES', data.data.winNumber)
          this.$router.push({name: 'profile'})
        }
        this.loading = false
      }).catch(e => {
        if (e) {
          this.$message.error('Failed!')
          this.loading = false
        }
      })
    },
    goAbout () {
      this.$router.push({name: 'about'})
    },
    goGameRoom (type) {
      this.loading = true
      this.loadingText = 'Waiting for join...'
      axiosWrapper('/user/findBattle', 'post', {
        type: type,
        token: this.token,
        roomNumber: this.roomNumber
      }).then(data => {
        if (data.flag) {
          this.roomNumber = data.data
          this.$store.commit('SET_ROOM_NUMBER', data.data)
          this.waitingForPlayer()
        } else {
          this.$message.error('Get Room Number Failed!')
        }
      }).catch(e => {
        if (e) {
          this.$message.error('Join Failed!')
          this.loading = false
        }
      })
    },
    createRoom () {
      this.loading = true
      axiosWrapper('/user/findBattle', 'post', {
        type: 'create',
        token: this.token,
        roomNumber: this.roomNumber
      }).then(data => {
        if (data.flag) {
          this.roomNumber = data.data
          this.$store.commit('SET_ROOM_NUMBER', data.data)
          this.loadingText = 'Your room number is ' + data.data + '. Waiting for another player...'
          this.waitingForPlayer()
        } else {
          this.$message.error('Get Room Number Failed!')
          this.loading = false
        }
      }).catch(e => {
        if (e) {
          this.$message.error('Create Room Failed!')
          this.loading = false
        }
      })
    },
    waitingForPlayer () {
      let updateFailed = false
      this.waitingTimer = setInterval(() => {
        axiosWrapper('/user/findBattle', 'post', {
          type: 'waiting',
          token: this.token,
          roomNumber: this.roomNumber
        }).then(data => {
          if (data.flag) {
            if (data.data) {
              clearInterval(this.waitingTimer)
              this.$store.commit('SET_ROOM_NUMBER', data.data.roomNumber)
              this.$store.commit('SET_OPPONENT', data.data.opponent)
              this.$store.commit('SET_QUESTIONS', data.data.questions)
              this.$router.push({name: 'battle'})
            }
          } else {
            if (!updateFailed) {
              clearInterval(this.waitingTimer)
              this.$message.error('Update Waiting Status Failed!')
              this.loading = false
              updateFailed = true
            }
          }
        })
      }, 1000)
    },
    allowSliding () {
      let box = document.getElementById('elCarousel')
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

      box.addEventListener('touchend', function () {
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
    },
    logOut (confirmed) {
      if (!this.onMobile) {
        this.$confirm('Are you sure log out?', 'Log Out', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then(() => {
          this.$store.commit('LOGOUT')
          this.$router.push({name: 'login'})
        })
      } else {
        this.showLogOut = true
        if (confirmed === true) {
          this.$store.commit('LOGOUT')
          this.$router.push({name: 'login'})
        }
      }
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

.welcome {
  width: 80%;
  text-align: center;
  font-size: 3rem;
  color: antiquewhite;
  margin-top: 50px;
}

.welcome p:nth-child(2) {
  margin-top: 10px;
  font-size: 1rem;
}

.lobbyContainer {
  width: 80%;
  max-width: 1200px;
  height: 40rem;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.lobbyContainer .el-button {
  margin-top: 20px;
}

.lobbyContainer .el-carousel {
  width: 80%;
}

.lobbyContainer .el-carousel__item {
  border-radius: 10px;
}

.lobbyContainer .el-carousel__item h3 {
  /*color: #475669;*/
  color: whitesmoke;
  font-size: 4rem;
  opacity: 0.75;
  margin-top: 160px;
  margin-left: 20px;
  text-align: left;
}

.lobbyContainer .el-carousel__item h6 {
  color: #475669;
  font-size: 1rem;
  opacity: 0.75;
  margin-left: 40px;
  text-align: left;
}

.lobbyContainer .el-carousel__item:nth-child(5n) {
  background-color: #CFA26B;
}

.lobbyContainer .el-carousel__item:nth-child(5n+1) {
  background-color: #AF887B;
}

.lobbyContainer .el-carousel__item:nth-child(5n+2) {
  background-color: #BEC0BF;
}

.lobbyContainer .el-carousel__item:nth-child(5n+3) {
  background-color: #888E84;
}

.lobbyContainer .el-carousel__item:nth-child(5n+4) {
  background-color: #B2867B;
}

.logOutCover {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99999;
  background-color: #B4ADAB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.logOutCover .el-button--danger {
  width: 80%;
  margin: 0;
}

.logOutCover .el-button--plain {
  width: 80%;
  margin-top: 20px;
  margin-left: 0;
}
</style>
