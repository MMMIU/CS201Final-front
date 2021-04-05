<template>
  <div class="login">
    <div id="rains" style="width: 100%;height: 100%;position: absolute"></div>
    <div class="container">
      <el-container v-loading="loading" class="userEnter" element-loading-background="rgba(250, 250, 250, 0.8)">
        <el-header height="13rem" class="welcome">
          Welcome
        </el-header>
        <el-main style="width: 80%">
          <el-input v-model="username" :placeholder="usernamePrompt"></el-input>
          <el-input type="password" :placeholder="passwordPrompt" v-model="password" style="margin-top: 1rem"
                    show-password></el-input>
<!--          <el-input type="password" :placeholder="passwordPrompt" v-model="password" style="margin-top: 1rem"-->
<!--                    show-password></el-input>-->
          <el-button type="primary" :disabled="loginButtonEnabled" style="width: 100%;margin-top: 1rem" @click="login">{{loginType}}
          </el-button>
          <div class="register">{{registerPrompt}}
            <span @click="changeMode">{{registerButtonText}}</span>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import LoginInfo from '../bean/LoginInfo'

export default {
  name: 'Login',
  data () {
    return {
      screenWidth: document.body.clientWidth,
      maxRainDrops: 10,
      currentRainDrops: 0,
      usernamePrompt: 'Username',
      passwordPrompt: 'Password',
      registerPrompt: 'Don\'t have an account?',
      registerButtonText: 'Register',
      username: '',
      password: '',
      checkCode: '',
      timer: null,
      loginType: LoginInfo.LOGIN,
      loginButtonEnabled: false,
      loading: false
    }
  },
  created () {
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    }
  },
  mounted: function () {
    if (document.body.clientWidth > 768) {
      let that = this
      that.timer = setInterval(function () {
        that.createRainDrop()
      }, 500)
    }
  },
  watch: {
    screenWidth (val) {
      if (val <= 768 && this.timer) {
        clearInterval(this.timer)
        this.timer = null
      } else if (val > 768 && !this.timer) {
        let that = this
        that.timer = setInterval(function () {
          that.createRainDrop()
        }, 500)
      }
    }
  },
  methods: {
    createRainDrop () {
      if (this.currentRainDrops >= this.maxRainDrops) {
        return
      }
      this.currentRainDrops++
      let rain = document.createElement('div')
      rain.style.position = 'fixed'
      rain.style.height = '10rem'
      rain.style.width = '0.125rem'
      rain.style.backgroundColor = 'white'
      rain.style.filter = 'blur(0.06rem)'
      rain.style.top = '0'
      rain.style.left = Math.random() * this.screenWidth / 16 + 'rem'
      rain.style.opacity = parseInt('' + Math.random() * 10) / 10 + ''
      document.getElementById('rains').appendChild(rain)
      let k = 1
      let that = this
      let tmpTimer = setInterval(function () {
        let height = parseInt(rain.style.top)
        k++
        rain.style.top = (height + 5 * Math.pow(k, 2)) / 16 + 'rem'
        if (rain.style.top >= this.clientHeight + 150) {
          clearInterval(tmpTimer)
          rain.parentNode.removeChild(rain)
          that.currentRainDrops--
        }
      }, 10)
    },
    changeMode () {
      this.loading = true
      if (this.loginType === LoginInfo.LOGIN) {
        this.loginType = LoginInfo.REGISTER
        this.usernamePrompt = 'New Username'
        this.passwordPrompt = 'New Password'
        this.registerButtonText = 'Login'
        this.registerPrompt = 'Already have an account?'
      } else {
        this.loginType = LoginInfo.LOGIN
        this.usernamePrompt = 'Username'
        this.passwordPrompt = 'Password'
        this.registerButtonText = 'Register'
        this.registerPrompt = 'Don\'t have an account?'
      }
      let that = this
      setTimeout(function () {
        that.loading = false
      }, 500)
    },
    login () {
      // this.$message.error('Login failed.')
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          axios.post('/login', {
            loginType: this.loginType,
            user: this.username,
            pass: this.password
          })
            .then((response) => {
              if (response.status === 200) {
                this.$store.commit('SET_TOKEN', response.data.token)
                this.$store.commit('GET_USER', response.data.user)
                this.$message({
                  message: '登陆成功',
                  type: 'success'
                })
                this.$router.push({name: 'activity'})
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
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
  width: 26rem;
  height: 40rem;
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 0 0 0.06rem hsla(0, 0%, 100%, .3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);
}

.login, .container::after {
  background-image: url("../../../static/images/login/ganyu.jpg");
  background-repeat: no-repeat;
  background-position: right;
  background-size: cover;
  background-attachment: fixed;
}

.container::after {
  content: '';
  position: absolute;
  margin: -2rem;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  filter: blur(1.3rem);
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
  margin-top: 12rem;
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
