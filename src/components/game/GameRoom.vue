<template>
  <div class="gameRoom" v-if="isRouterAlive">
    <div class="container"
         v-loading="loading"
         element-loading-background="rgba(250, 250, 250, 0.8)"
         :element-loading-text="loadingText"
    >
      <div class="startCover" v-if="state===0"><div>{{countDown}}</div></div>
      <div class="endCover" v-if="state===2">
        <div id="endSlogan">{{ endSlogan }}</div>
        <div id="endScorePanel">
          <div>
            {{username}}: {{p1Score}}<br>
            {{opponent}}: {{p2Score}}
          </div>
        </div>
        <div id="endOptionsPanel">
          <el-button type="primary" style="width: 100%;margin-top: 1rem" @click="goBack">Back To Lobby</el-button>
          <el-button type="primary" style="width: 100%;margin-top: 1rem" @click="newRound">Another Round</el-button>
        </div>
      </div>
      <el-container>
        <el-header class="scorePanel">
          <div id="p1" class="p1Progress playerScoreProgress"
               :style="{width: Math.round((((p1Score+p2Score)>0?((5+p1Score)/(p1Score+p2Score+10)*100):50)))+'%'}">
            <p>{{username}}</p>
            <p>{{p1Score}}</p>
          </div>
          <div id="p2" class="p2Progress playerScoreProgress">
            <p>{{opponent}}</p>
            <p>{{p2Score}}</p>
          </div>
        </el-header>
        <el-container>
          <el-header class="timerPanel" height="10px">
            <div class="timerProgress" :style="{width: (answerTimeRemain/answerTime*100)+'%'}"></div>
          </el-header>
          <el-container class="questionPanel">
            <el-header>{{ question }}</el-header>
            <el-main class="optionPanel">
              <el-button v-for="(option,index) in options"
                         :id="'option'+index"
                         :disabled="buttonDisabled"
                         :key="option" @click="checkChoice(index)"
                         :loading="buttonDisabled&&index===choice"
                         :type="buttonDisabled?(index===choice?(choice===correctChoice?'success':'danger'):''):''"
              >{{ option }}</el-button>
            </el-main>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import {axiosWrapper} from '../../api'

const PREPARING = 0
const ANSWERING = 1
const FINISHING = 2
export default {
  name: 'GameRoom',
  data () {
    return {
      username: this.$store.state.username,
      token: this.$store.state.token,
      roomNumber: this.$store.state.roomNumber,
      opponent: this.$store.state.opponent,
      countDown: 3,
      state: PREPARING,
      p1Score: 0,
      p2Score: 0,
      questionIndex: 1,
      answerTime: 10,
      answerTimeRemain: 0,
      answerTimer: null,
      question: null,
      options: null,
      endSlogan: null,
      showScores: false,
      showEndOptions: false,
      loading: false,
      loadingText: null,
      buttonDisabled: false,
      correctChoice: -1,
      choice: -1,
      isRouterAlive: true,
      scoreGetTimer: null,
      scoreGetCount: 0,
      scoreUploaded: false
    }
  },
  mounted () {
    // history.pushState(null, null, document.URL)
    // window.addEventListener('popstate', function () {
    //   history.pushState(null, null, document.URL)
    // })
    this.answerTimeRemain = this.answerTime
    this.question = this.$store.state.questions[this.questionIndex - 1].question
    this.options = this.$store.state.questions[this.questionIndex - 1].options
    this.correctChoice = this.$store.state.questions[this.questionIndex - 1].answer
    this.startCountDown()
  },
  methods: {
    goBack () {
      clearInterval(this.answerTimer)
      this.$store.commit('CLEAR_ROOM')
      this.$router.push({name: 'lobby'})
    },
    startCountDown () {
      let timer = setInterval(() => {
        this.countDown--
        if (this.countDown <= 0) {
          this.countDown = 'Start!'
          setTimeout(() => {
            this.state = ANSWERING
            this.questionCountDown()
            this.getP2Score()
          }, 1000)
          clearInterval(timer)
        }
      }, 1000)
    },
    questionCountDown () {
      this.answerTimer = setInterval(() => {
        this.answerTimeRemain--
        if (this.answerTimeRemain < 0) {
          this.answerTimeRemain = this.answerTime
          this.nextQuestion()
        }
      }, 1000)
    },
    nextQuestion () {
      if (!this.scoreUploaded) {
        this.uploadScore()
      }
      if (this.questionIndex >= this.$store.state.questions.length) {
        clearInterval(this.answerTimer)
        this.answerTimer = null
        this.loading = true
        this.loadingText = 'Waiting for score update...'
        this.finishMatchHelper()
        return
      }
      this.scoreUploaded = false
      this.buttonDisabled = false
      this.questionIndex++
      this.question = this.$store.state.questions[this.questionIndex - 1].question
      this.options = this.$store.state.questions[this.questionIndex - 1].options
      this.correctChoice = this.$store.state.questions[this.questionIndex - 1].answer
    },
    checkChoice (index) {
      this.choice = index
      this.buttonDisabled = true
      if (index === this.correctChoice) {
        this.p1Score++
      }
      this.scoreUploaded = true
      this.uploadScore()
    },
    uploadScore () {
      axiosWrapper('/requestScore', 'post',
        {
          type: 'uploadScore',
          token: this.token,
          index: this.questionIndex,
          score: this.choice === this.correctChoice ? 1 : 0,
          roomNumber: this.roomNumber
        }).then(data => {
        console.log('upload succeed')
      }).catch(e => {
        if (e) {
          this.$message.error('Upload Score Failed!')
        }
      })
    },
    getP2Score () {
      clearInterval(this.scoreGetTimer)
      this.scoreGetTimer = setInterval(() => {
        axiosWrapper('/requestScore', 'post',
          {
            type: 'getScore',
            token: this.token,
            roomNumber: this.roomNumber
          }).then(data => {
          this.p2Score = data.data.opponentScore
          this.scoreGetCount = data.data.questionAnswered
          console.log('get score succeed')
          if (this.scoreGetCount >= this.$store.state.questions.length) {
            clearInterval(this.scoreGetTimer)
            this.finishMatchHelper()
          }
        }).catch(e => {
          if (e) {
            this.$message.error('Update score Failed!')
            console.log(e)
          }
        })
      }, 1000)
    },
    finishMatchHelper () {
      setTimeout(() => {
        this.finishMatch()
      }, 1000)
    },
    finishMatch () {
      if (this.answerTimer !== null) return
      if (this.scoreGetCount < this.$store.state.questions.length) return
      this.state = FINISHING
      this.loading = false
      if (this.p1Score > this.p2Score) {
        this.endSlogan = 'You Win'
      } else if (this.p1Score < this.p2Score) {
        this.endSlogan = 'You Lose'
      } else {
        this.endSlogan = 'Tie!'
      }
      setTimeout(() => {
        let slogan = document.getElementById('endSlogan')
        if (!slogan) return
        slogan.style.height = '30%'
        slogan.style.fontSize = '3rem'
        this.showScores = true
        showEndScorePanel()
      }, 1000)
      function showEndScorePanel () {
        setTimeout(() => {
          let endScorePanel = document.getElementById('endScorePanel')
          if (!endScorePanel) return
          endScorePanel.style.opacity = '1'
          endScorePanel.style.marginTop = '0'
          showEndOptionsPanel()
        }, 500)
      }
      function showEndOptionsPanel () {
        setTimeout(() => {
          let endOptionsPanel = document.getElementById('endOptionsPanel')
          if (!endOptionsPanel) return
          endOptionsPanel.style.opacity = '1'
          endOptionsPanel.style.marginTop = '0'
        }, 500)
      }
    },
    newRound () {
      this.loading = true
      this.loadingText = this.loadingText = 'Waiting for join...'
      axiosWrapper('/requestroom', 'post', {type: 'join', token: this.token}).then(data => {
        this.$store.commit('SET_ROOM_NUMBER', data.data.roomNumber)
        this.$store.commit('SET_OPPONENT', data.data.opponent)
        this.$store.commit('SET_QUESTIONS', data.data.questions)
        this.$message.success('Join Success!')
        this.reload()
      }).catch(e => {
        if (e) {
          this.$message.error('Join Failed!')
          this.loading = false
        }
      })
    },
    reload () {
      this.isRouterAlive = false
      this.answerTimeRemain = this.answerTime
      this.questionIndex = 1
      this.question = this.$store.state.questions[this.questionIndex - 1].question
      this.options = this.$store.state.questions[this.questionIndex - 1].options
      this.opponent = this.$store.state.opponent
      this.correctChoice = this.$store.state.questions[this.questionIndex - 1].answer
      console.log(this.correctChoice)
      this.countDown = 3
      this.state = PREPARING
      this.loading = false
      this.loadingText = null
      this.p1Score = 0
      this.p2Score = 0
      this.choice = -1
      this.buttonDisabled = false
      this.scoreGetCount = 0
      clearInterval(this.scoreGetTimer)
      clearInterval(this.answerTimer)
      this.startCountDown()
      this.$nextTick(() => (this.isRouterAlive = true))
    }
  }
}
</script>

<style scoped>
.gameRoom {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.startCover{
  width: 100%;
  height: 100%;
  background-color: #42b983;
  color: antiquewhite;
  display: flex;
  justify-content: center;
  align-items: center;
}
.startCover div{
  font-size: 10rem;
}
.endCover{
  width: 100%;
  height: 100%;
  background-color: #409EFF;
  color: antiquewhite;
}

#endSlogan{
  position: absolute;
  width: 100%;
  height: 100%;
  /*background-color: #303133;*/
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10rem;
  transition: 1s;
  z-index: 3;
}

#endScorePanel{
  position: absolute;
  top: 30%;
  opacity: 0;
  width: 100%;
  height: 40%;
  margin-top: 50px;
  /*background-color: #606266;*/
  transition: 1s;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}
#endScorePanel div{
  text-align: center;
}

#endOptionsPanel{
  position: absolute;
  top: 70%;
  opacity: 0;
  width: 100%;
  height: 30%;
  margin-top: 50px;
  /*background-color: #606266;*/
  transition: 1s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  background-color: rgb(255,245,247);
  width: 80%;
  height: 40rem;
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 0 0 0.06rem hsla(0, 0%, 100%, .3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);
}

.timerPanel{
  background-color: #303133;
  padding: 0;
}

.timerProgress{
  margin-left: 0;
  height: 100%;
  background-color: #60BEFF;
  transition: 1s linear;
}

.scorePanel{
  background-color: #60BEFF;
  width: 100%;
  padding: 0;
}
.playerScoreProgress{
  height: 100%;
  transition: 1s;
}
.p1Progress{
  float: left;
  background-color: #42b983;
  min-width: 100px;
  max-width: calc(100% - 100px);
}

.p2Progress{
  float: right;
  text-align: right;
}

.optionPanel .el-button{
  margin-left: 0;
  width: 100%;
  margin-top: 20px;
}
.backButton {
  color: #303133;
  text-align: center;
  margin-bottom: 3rem;
}

.backButton span{
  color: #409EFF;
  cursor: pointer;
}

.backButton span:hover{
  color: #60BEFF;
}

@media (max-width: 48rem) {
  .el-header {
    color: black;
  }

  .container {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
  }

  .container::after {
    display: none;
  }

  .backButton {
    background-color: rgba(255, 255, 255, 0);
  }

  .backButton {
    margin-top: 1rem;
    color: #606266;
  }
}
</style>
