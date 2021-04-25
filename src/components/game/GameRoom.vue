<template>
  <div class="gameRoom">
    <div class="container"
         v-loading="loading"
         element-loading-background="rgba(250, 250, 250, 0.8)"
         :element-loading-text="loadingText"
    >
      <div class="startCover" v-if="state===0">
        <div>{{ startCountDownSecond }}</div>
      </div>
      <div class="endCover" :style="{backgroundColor: user.score>opponent.score?'#409EFF':'#E6A23C'}" v-if="state===2">
        <div id="endSlogan">{{ endSlogan }}</div>
        <div id="endScorePanel">
          <div>
            {{ user.name }}'s Score:&nbsp;<br>
            {{ opponent.name }}'s Score:&nbsp;
          </div>
          <div>
            &nbsp;{{ user.score }}<br>
            &nbsp;{{ opponent.score }}
          </div>
        </div>
        <div id="endOptionsPanel">
          <el-button :type="user.score>opponent.score?'primary':'warning'" style="width: 100%;margin-top: 1rem"
                     @click="goBack(false)">Back To Lobby
          </el-button>
        </div>
      </div>
      <el-container>
        <el-header class="scorePanel">
          <div id="p1" class="p1Progress playerScoreProgress"
               :style="{width: Math.round((((user.score+opponent.score)>0?((user.score)/(user.score+opponent.score)*100):50)))+'%'}">
            <p>{{ user.name }}&nbsp;{{ user.score }}</p>
          </div>
          <div id="p2" class="p2Progress playerScoreProgress">
            <p>{{ opponent.score }}&nbsp;{{ opponent.name }}</p>
          </div>
        </el-header>
        <el-container>
          <el-header height="40px" class="timerAndProgress">
            <div class="timerPanel">
              <div class="timerBar" :style="{width: (answerTimeRemain/answerTime*100)+'%'}"></div>
            </div>
            <el-steps class="steps" :active="question.index">
              <el-step v-for="(item,index) in correctOrNot" :key="'step'+index" :status="item"></el-step>
            </el-steps>
          </el-header>
          <el-container class="questionPanel">
            <el-header><p>{{ question.content }}</p></el-header>
            <el-main class="optionPanel">
              <el-button v-for="(option,index) in question.options"
                         :id="'option'+index"
                         :disabled="buttonDisabled"
                         :key="option"
                         :loading="buttonDisabled&&index===user.choice"
                         :type="buttonDisabled?(index===user.choice?(user.choice===question.correctChoice?'success':'danger'):''):(index%2===0?'':'info')"
                         @click="checkChoice(index)"
              >{{ option }}
              </el-button>
            </el-main>
            <el-footer>
              <el-button type="danger" @click="confirmGoBack">Quit</el-button>
            </el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
    <div class="logOutCover" v-if="showLogOut">
      <el-button type="danger" @click="goBack(true)">Quit?</el-button>
      <el-button type="plain" @click="showLogOut=false">Cancel</el-button>
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
  inject: ['reload'],
  data () {
    return {
      roomNumber: null,
      state: PREPARING,
      startCountDownSecond: 3,
      user: {
        token: null,
        name: this.$store.state.username,
        score: 0,
        answerFinished: false,
        choice: -1
      },
      opponent: {
        name: this.$store.state.opponent,
        score: 0,
        answerFinished: false
      },
      questions: this.$store.state.questions,
      question: {
        index: 1,
        content: null,
        options: null,
        correctChoice: -1
      },
      answerTime: 10,
      answerTimeRemain: 0,
      answerTimer: null,
      endSlogan: null,
      showScores: false,
      showEndOptions: false,
      loading: false,
      loadingText: null,
      buttonDisabled: false,
      correctOrNot: [],
      scoreGetTimer: null,
      scoreGetCount: 0,
      scoreUploaded: false,
      winConditionCheckerTimer: null,
      showLogOut: false,
      onMobile: (document.body.clientWidth <= this.MOBILE)
    }
  },
  created () {
    this.user.token = this.$store.state.token
    this.roomNumber = this.$store.state.roomNumber
    this.answerTimeRemain = this.answerTime
    this.question.content = this.questions[this.question.index - 1].question
    this.question.options = this.questions[this.question.index - 1].options
    this.question.correctChoice = this.questions[this.question.index - 1].answer
    for (let i = 0; i < this.questions.length; i++) {
      this.correctOrNot.push('')
    }
    window.addEventListener('resize', () => {
      if (document.body.clientWidth > this.MOBILE && this.onMobile) {
        this.onMobile = false
      }
      if (document.body.clientWidth <= this.MOBILE && !this.onMobile) {
        this.onMobile = true
      }
    })
    window.addEventListener('beforeunload', () => {
      if (this.state === ANSWERING) {
        this.goBack(true)
      }
    })
  },
  mounted () {
    this.startCountDown()
  },
  methods: {
    goBack (midway) {
      if (midway) {
        axiosWrapper('/battleroom/winCondition', 'post',
          {
            token: this.user.token,
            roomNumber: this.roomNumber
          }).then(data => {
          if (!data.flag) {
            console.log('Quit Failed')
          }
        }).catch(e => {
          if (e) {
            this.$message.error('Server Error')
          }
        })
      }
      clearInterval(this.answerTimer)
      clearInterval(this.scoreGetTimer)
      clearInterval(this.winConditionCheckerTimer)
      this.$store.commit('CLEAR_ROOM')
      this.$router.push({name: 'lobby'})
    },
    confirmGoBack () {
      if (!this.onMobile) {
        this.$confirm('Are you sure?', 'Back To Lobby', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then(() => {
          this.goBack(true)
        })
      } else {
        this.showLogOut = true
      }
    },
    startCountDown () {
      let timer = setInterval(() => {
        this.startCountDownSecond--
        if (this.startCountDownSecond <= 0) {
          this.startCountDownSecond = 'Start!'
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
      if (this.state !== ANSWERING) return
      if (!this.scoreUploaded) {
        this.uploadScore(this.question.index, 0)
      }
      if (this.question.index >= this.questions.length) {
        clearInterval(this.answerTimer)
        this.answerTimer = null
        this.loading = true
        this.loadingText = 'Waiting for score update...'
        return
      }
      this.scoreUploaded = false
      this.buttonDisabled = false
      this.question.index++
      this.question.content = this.questions[this.question.index - 1].question
      this.question.options = this.questions[this.question.index - 1].options
      this.question.correctChoice = this.questions[this.question.index - 1].answer
    },
    checkChoice (index) {
      this.user.choice = index
      this.buttonDisabled = true
      if (index === this.question.correctChoice) {
        this.user.score++
      }
      this.scoreUploaded = true
      this.uploadScore(this.question.index, this.user.choice === this.question.correctChoice ? 1 : 0)
    },
    uploadScore (index, score) {
      this.scoreUploaded = true
      if (score > 0) {
        this.correctOrNot[this.question.index - 1] = 'success'
        axiosWrapper('/battleroom/addPoints', 'post',
          {
            token: this.user.token,
            roomNumber: this.roomNumber
          }).then(() => {
          console.log('Score Uploaded')
          if (this.question.index >= this.questions.length) {
            this.checkWinCondition()
          }
        }).catch(e => {
          if (e) {
            this.$message.error('Server Error')
          }
        })
      } else {
        this.correctOrNot[this.question.index - 1] = 'error'
        if (this.question.index >= this.questions.length) {
          this.checkWinCondition()
        }
      }
    },
    getP2Score () {
      clearInterval(this.scoreGetTimer)
      this.scoreGetTimer = setInterval(() => {
        axiosWrapper('/battleroom/requestScore', 'post',
          {
            token: this.user.token,
            roomNumber: this.roomNumber
          }).then(data => {
          if (data.flag) {
            if (data.data) {
              console.log('Opponent\'s Score Updated')
              this.opponent.score = data.data
            }
          } else {
            this.$message.error('Update score Failed!')
          }
        }).catch(e => {
          if (e) {
            this.$message.error('Server Error')
            console.log(e)
          }
        })
      }, 2000)
    },
    checkWinCondition () {
      if (this.state !== ANSWERING) return
      let checkFailed = false
      this.winConditionCheckerTimer = setInterval(() => {
        axiosWrapper('/battleroom/winCondition', 'post',
          {
            token: this.user.token,
            roomNumber: this.roomNumber
          }).then(data => {
          console.log('Checking win condition')
          if (data.flag) {
            if (data.data) {
              console.log('Win condition checked')
              clearInterval(this.answerTimer)
              clearInterval(this.winConditionCheckerTimer)
              clearInterval(this.scoreGetTimer)
              setTimeout(() => {
                this.finishMatch()
              }, 1000)
            }
          } else {
            if (!checkFailed) {
              checkFailed = true
              clearInterval(this.winConditionCheckerTimer)
              this.$message.error('Checked win condition Failed!')
              setTimeout(() => {
                this.finishMatch()
              }, 1000)
            }
          }
        }).catch(e => {
          if (e) {
            if (!checkFailed) {
              checkFailed = true
              this.$message.error('Server Error')
              setTimeout(() => {
                this.finishMatch()
              }, 1000)
            }
          }
        })
      }, 1000)
    },
    finishMatch () {
      clearInterval(this.winConditionCheckerTimer)
      this.state = FINISHING
      this.loading = false
      if (this.user.score > this.opponent.score) {
        this.endSlogan = 'You Win'
      } else if (this.user.score < this.opponent.score) {
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
    }
  }
}
</script>

<style scoped>
.gameRoom {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.startCover {
  width: 100%;
  height: 100%;
  background-color: #42b983;
  color: antiquewhite;
  display: flex;
  justify-content: center;
  align-items: center;
}

.startCover div {
  font-size: 10rem;
}

.endCover {
  width: 100%;
  height: 100%;
  color: antiquewhite;
}

#endSlogan {
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

#endScorePanel {
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

#endScorePanel div {
  text-align: center;
  width: 50%;
}

#endScorePanel div:nth-child(1) {
  text-align: right;
}

#endScorePanel div:nth-child(2) {
  text-align: left;
}

#endOptionsPanel {
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
  background-color: rgb(255, 245, 247);
  width: 80%;
  height: 40rem;
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 0 0 0.06rem hsla(0, 0%, 100%, .3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);
}

.timerAndProgress {
  padding: 0;
}

.timerPanel {
  background-color: #303133;
}

.timerBar {
  margin-left: 0;
  height: 10px;
  background-color: #60BEFF;
  transition: 1s linear;
}

.steps {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
}

.scorePanel {
  background-color: #60BEFF;
  width: 100%;
  padding: 0;
}

.playerScoreProgress {
  height: 100%;
  transition: 1s;
  font-size: 20px;
  line-height: 4rem;
  color: whitesmoke;
}

.p1Progress {
  float: left;
  background-color: #42b983;
  min-width: 150px;
  max-width: calc(100% - 150px);
  text-indent: 10px;
}

.p2Progress {
  float: right;
  text-align: right;
  padding-right: 10px;
}

.questionPanel .el-header {
  margin-top: 20px;
  font-size: 25px;
}

.optionPanel .el-button {
  margin-left: 0;
  width: 100%;
  margin-top: 15px;
  height: 70px;
}

.optionPanel .el-button--info {
  color: #303133;
  background-color: #EBEEF5;
}

.questionPanel .el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.questionPanel p {
  word-wrap: break-word;
}

.backButton {
  color: #303133;
  text-align: center;
  margin-bottom: 3rem;
}

.backButton span {
  color: #409EFF;
  cursor: pointer;
}

.backButton span:hover {
  color: #60BEFF;
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

@media (max-width: 48rem) {
  .container {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
  }

  .optionPanel {
    margin-top: 50px;
  }

  #endScorePanel {
    font-size: 1rem;
  }
}
</style>
