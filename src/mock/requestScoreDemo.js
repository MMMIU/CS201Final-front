let loginDemo = {
  questionAnswered: 0,
  opponentScore: 0
}
let timer = null

function increase () {
  if (timer) return
  timer = setInterval(() => {
    loginDemo.questionAnswered++
    if (loginDemo.opponentScore < 2) {
      loginDemo.opponentScore++
    }
    if (loginDemo.questionAnswered >= 4) {
      clearInterval(timer)
      timer = null
    }
  }, 10000)
}

export default {
  'post|/getScore': option => {
    increase()
    return {
      status: 200,
      data: loginDemo
    }
  }
}
