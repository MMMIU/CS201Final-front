let loginDemo = {
  questionAnswered: 0,
  opponentScore: 0
}
let timer = null
function increase () {
  if (timer) return
  if (loginDemo.questionAnswered >= 2) return
  timer = setInterval(() => {
    loginDemo.questionAnswered++
    loginDemo.opponentScore++
    if (loginDemo.questionAnswered === 2) {
      clearInterval(timer)
      timer = null
    }
  }, 10000)
}
export default {
  'post|/requestScore': option => {
    increase()
    return {
      status: 200,
      data: loginDemo
    }
  }
}
