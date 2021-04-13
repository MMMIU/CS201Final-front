<template>
<div class="lobby" v-loading="loading"   :element-loading-text="roomNumberText" element-loading-background="rgba(250, 250, 250, 0.8)">
  <div class="welcome">Welcome {{username}} {{token}}</div>
  <div id="lobbyContainer" v-if="!onMobile" >
      <el-carousel id="elCarousel" trigger="click" :interval="5000" type="card" v-on:change="changeIndex">
        <el-carousel-item v-for="(item,index) in optionList" :key="item">
          <h3 @click="goOption(index)">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
  </div>
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
      loading: false,
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      roomNumber: this.$store.state.roomNumber,
      roomNumberText: null,
      joinButtonEnabled: false,
      onMobile: (document.body.clientWidth <= this.MOBILE),
      optionList: ['Start', 'Join', 'Profile', 'Create'],
      activeIndex: 0,
      waitingTimer: null
    }
  },
  created () {
    window.addEventListener('resize', () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
        this.screenHeight = document.body.clientHeight
        if (this.screenWidth > this.MOBILE && this.onMobile) {
          this.onMobile = false
        }
        if (this.screenWidth <= this.MOBILE && !this.onMobile) {
          this.onMobile = true
        }
      })()
    })
  },
  mounted () {
    this.onMobile = document.body.clientWidth <= this.MOBILE
  },
  methods: {
    changeIndex (val) {
      this.activeIndex = val
    },
    goOption (index) {
      if (index !== this.activeIndex) return
      switch (this.activeIndex) {
        case 0:
          this.goGameRoom()
          break
        case 1:
          this.openJoinBox()
          break
        case 2:
          this.goProfile()
          break
        case 3:
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
      axiosWrapper('/requestprofile', 'post', {type: 'join', token: this.token}).then(data => {
        this.$store.commit('SET_TOTAL_GAMES', data.data.totalGames)
        this.$store.commit('SET_WIN_GAMES', data.data.winGames)
        this.$router.push({name: 'profile'})
        this.$message.success('Assign Success!')
      }).catch(e => {
        if (e) {
          this.$message.error('Failed!')
        }
      })
    },
    goGameRoom () {
      this.loading = true
      axiosWrapper('/requestroom', 'post', {type: 'join', token: this.token, roomNumber: this.roomNumber}).then(data => {
        this.$store.commit('SET_ROOM_NUMBER', data.data.roomNumber)
        this.$store.commit('SET_OPPONENT', data.data.opponent)
        this.$store.commit('SET_QUESTIONS', data.data.questions)
        this.$message.success('Assign Success!')
        this.$router.push({name: 'gameroom'})
      }).catch(e => {
        if (e) {
          this.$message.error('Join Failed!')
        }
      })
    },
    createRoom () {
      this.loading = true
      axiosWrapper('/requestroom', 'post', {type: 'create', token: this.token}).then(data => {
        this.$store.commit('SET_ROOM_NUMBER', data.data.roomNumber)
        this.roomNumberText = 'Your room number is ' + data.data.roomNumber + '. Waiting for another player...'
        this.waitingForPlayer()
      }).catch(e => {
        if (e) {
          this.$message.error('Create Failed!')
        }
      })
    },
    waitingForPlayer () {
      this.waitingTimer = setInterval(() => {
        axiosWrapper('/requestroom', 'post', {type: 'create', token: this.token}).then(data => {
          if (!data.data.opponent) return
          if (this.$store.state.opponent) return
          clearInterval(this.waitingTimer)
          this.$store.commit('SET_OPPONENT', data.data.opponent)
          this.$store.commit('SET_QUESTIONS', data.data.questions)
          this.$router.push({name: 'gameroom'})
          this.$message.success('Assign Success!')
        })
      }, 100)
    }
  }

}
</script>

<style scoped>
.lobby {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.welcome{
  width: 100px;
  height: 20px;
  position: fixed;
  top: 0;
  left: 0;
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
