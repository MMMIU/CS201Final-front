<template>
  <div class="login">
    <div class="container">
      <el-container v-loading="loading" class="userEnter" element-loading-background="rgba(250, 250, 250, 0.8)">
        <el-header height="13rem" class="welcome">
          Welcome
        </el-header>
        <el-main style="width: 80%">
          <el-input v-model="username" :placeholder="usernamePrompt"></el-input>
          <el-input type="password" :placeholder="passwordPrompt" v-model="password" style="margin-top: 1rem"
                    show-password></el-input>
          <el-input v-show="showConfirmInput" type="password" placeholder="Confirm Password" v-model="password" style="margin-top: 1rem"
                    show-password></el-input>
          <el-button type="primary" :disabled="loginButtonEnabled" style="width: 100%;margin-top: 1rem" @click="login">{{ type | upperCase}}
          </el-button>
        </el-main>
        <el-footer class="register">{{registerPrompt}}
          <span @click="changeMode">{{registerButtonText}}</span>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
import {axiosWrapper} from '../../api/index'
const LOGIN = 'login'
const REGISTER = 'register'
export default {
  name: 'Login',
  data () {
    return {
      screenWidth: document.body.clientWidth,
      usernamePrompt: 'username',
      passwordPrompt: 'Password',
      registerPrompt: 'Don\'t have an account?',
      registerButtonText: 'Register',
      username: '',
      password: '',
      checkCode: '',
      timer: null,
      type: LOGIN,
      loginButtonEnabled: false,
      loading: false,
      showConfirmInput: false,
      waitTime: 500
    }
  },
  created () {
    window.addEventListener('resize', () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    })
  },
  methods: {
    changeMode () {
      this.loading = true
      if (this.type === LOGIN) {
        this.type = REGISTER
        this.usernamePrompt = 'New username'
        this.passwordPrompt = 'New Password'
        this.registerButtonText = 'Login'
        this.registerPrompt = 'Already have an account?'
      } else {
        this.type = LOGIN
        this.usernamePrompt = 'username'
        this.passwordPrompt = 'Password'
        this.registerButtonText = 'Register'
        this.registerPrompt = 'Don\'t have an account?'
      }
      let that = this
      setTimeout(function () {
        that.loading = false
      }, this.waitTime)
    },
    login () {
      axiosWrapper('/logincheck', 'post', {username: this.username, password: this.password}).then(data => {
        console.log(data)
        this.$store.commit('SET_TOKEN', data.data.token)
        this.$store.commit('SET_USER', data.data.username)
        this.$message.success('login Success!')
        clearInterval(this.timer)
        this.loading = true
        setTimeout(() => {
          this.$router.push({name: 'lobby'})
        }, 1000)
      }).catch(e => {
        if (e) {
          this.$message.error(this.type + ' Failed!')
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  min-height: 30rem;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.container {
  background-color: rgba(200,200,200,0.5);
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

.userEnter {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}

.userEnter {
  background-color: rgba(255, 255, 255, 0.1);
}

.register {
  color: #303133;
  text-align: center;
  margin-bottom: 3rem;
}

.register span{
  color: #409EFF;
  cursor: pointer;
}

.register span:hover{
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

  .userEnter {
    background-color: rgba(255, 255, 255, 0);
  }

  .register {
    margin-top: 1rem;
    color: #606266;
  }
}
</style>
