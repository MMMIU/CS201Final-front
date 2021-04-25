<template>
  <div class="profile">
    <div class="container">
      <el-container class="panel" element-loading-background="rgba(250, 250, 250, 0.8)">
        <el-header height="13rem" class="welcome">
          TEAM 24
        </el-header>
        <el-main style="width: 80%">
          <div class="block">
            <p> Yifei Miao&nbsp; </p>
            <p> Chu Fang&nbsp; </p>
            <p> Yuxuan Guo&nbsp; </p>
            <p> Andy Chen&nbsp; </p>
            <p> Qingpei Li&nbsp; </p>
            <p> Iris Lu&nbsp; </p>
          </div>
          <div class="block">
            <p>yifeimia@usc.edu</p>
            <p>chufang@usc.edu</p>
            <p>yguo3044@usc.edu</p>
            <p>chenandy@usc.edu</p>
            <p>qingpeil@usc.edu</p>
            <p>yuetong@usc.edu</p>
          </div>
        </el-main>
        <el-footer class="backButton">
          <el-button type="primary" style="width: 100%;margin-top: 1rem" @click="goBack">Back To Lobby</el-button>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    goBack () {
      this.$router.push({name: 'lobby'})
    }
  }
}
</script>

<style scoped>
.profile {
  width: 100%;
  height: 100%;
  min-height: 30rem;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.container {
  background-color: rgba(200, 200, 200, 0.5);
  width: 26rem;
  height: 40rem;
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 0 0 0.06rem hsla(0, 0%, 100%, .3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);
}

.welcome {
  line-height: 13rem;
  color: white;
  font-size: 2rem;
  font-weight: 100;
}

.panel {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
}

.el-main {
  padding: 0;
}

.block {
  height: 100%;
  float: left;
  line-height: 30px;
  color: #303133;
}

.block:nth-child(1) {
  width: 50%;
  color: white;
}

.backButton {
  color: #303133;
  text-align: center;
  margin-bottom: 5rem;
}

.backButton span {
  color: #409EFF;
  cursor: pointer;
}

.backButton span:hover {
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

  .panel {
    background-color: rgba(255, 255, 255, 0);
  }

  .backButton {
    margin-top: 1rem;
    color: #606266;
  }
}
</style>
