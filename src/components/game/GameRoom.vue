<template>
  <div class="gameRoom">
    <div class="statistic">Welcome {{username}} {{token}}</div>
    <div class="container">
      <el-container>
        <el-header class="scorePanel">1</el-header>
        <el-container>
          <el-header>0</el-header>
          <el-container>
            <el-header>111</el-header>
            <el-main>3</el-main>
            <el-footer class="backButton">
              <el-button type="primary" style="width: 100%;margin-top: 1rem" @click="goBack">Back To Lobby</el-button>
            </el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameRoom',
  data () {
    return {
      username: this.$store.state.username,
      token: this.$store.state.token,
      total: this.$store.state.totalGames,
      win: this.$store.state.winGames,
      winRate: 0
    }
  },
  mounted () {
    this.winRate = this.total <= 0 ? 0 : (this.win / this.total * 100)
  },
  methods: {
    goBack () {
      this.$router.push({name: 'lobby'})
    }
  }
}
</script>

<style scoped>
.gameRoom {
  width: 100%;
  height: 100%;
  min-height: 30rem;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.statistic{
  position: fixed;
  top: 0;
  left: 0;
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

.scorePanel{
  background-color: #60BEFF;
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
