<template>
  <div class="login">
    <div class="container">
      <el-container id="loginContainer" v-loading="loading" class="userEnter"
                    element-loading-background="rgba(250, 250, 250, 0.8)">
        <el-header height="11rem" class="welcome">
          {{ type | upperCase }}
        </el-header>
        <el-main style="width: 80%">
          <el-form :rules="rules" :model="form" ref="loginForm">
            <el-form-item prop="username">
              <el-input v-model="form.username" :placeholder="usernamePrompt"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" :placeholder="passwordPrompt" v-model="form.password" show-password
                        @keyup.enter.native="submit"></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <el-input v-show="type==='register'" type="password" placeholder="Confirm Password"
                        v-model="form.checkPassword" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" :disabled="loginButtonEnabled" @click="submit" style="width: 100%
">{{ type | upperCase }}
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" :disabled="loginButtonEnabled" @click="touristLogin" style="width: 100%">
                {{ 'Continue as Tourist' | upperCase }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-main>
        <el-footer class="register">{{ registerPrompt }}
          <span @click="changeMode">{{ registerButtonText }}</span>
        </el-footer>
      </el-container>
      <div id="containerBackground" class="containerBackground">
        <div id="containerBackgroundCircle" class="containerBackgroundCircle"
             :style="{width: mouseHovering?'100%':0, height: mouseHovering?'100%':0}"></div>
      </div>
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
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Password should not be empty'))
      } else {
        if (this.form.checkPassword || this.form.checkPassword !== '') {
          this.$refs.loginForm.validateField('checkPassword')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '' && this.type === REGISTER) {
        callback(new Error('This field should not be empty'))
      } else if (value !== this.form.password && this.type === REGISTER) {
        callback(new Error('Inconsistent password'))
      } else {
        callback()
      }
    }
    return {
      screenWidth: document.body.clientWidth,
      usernamePrompt: 'Username',
      passwordPrompt: 'Password',
      registerPrompt: 'Don\'t have an account?',
      registerButtonText: 'Register',
      type: LOGIN,
      form: {
        username: '',
        password: '',
        checkPassword: ''
      },
      rules: {
        username: [
          {required: true, message: 'Username should not be empty', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'This field should not be empty1', trigger: 'blur'},
          {validator: validatePass, trigger: 'change'}
        ],
        checkPassword: [
          {validator: validatePass2, trigger: 'change'}
        ]
      },
      loginButtonEnabled: false,
      loading: false,
      showConfirmInput: true,
      waitTime: 500,
      mouseHovering: false,
      backgroundChangeTime: 0.5,
      changeBusy: false,
      onMobile: (document.body.clientWidth <= this.MOBILE),
      REGISTER
    }
  },
  created () {
    this.$store.commit('LOGOUT')
    window.addEventListener('resize', () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
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
    let container = document.getElementById('loginContainer')
    let containerBackground = document.getElementById('containerBackground')
    let containerBackgroundCircle = document.getElementById('containerBackgroundCircle')
    containerBackgroundCircle.style.transition = this.backgroundChangeTime + 's'
    container.addEventListener('mouseenter', (e) => {
      if (this.onMobile) return
      containerBackground.style.left = e.offsetX - Math.floor((containerBackground.clientWidth + 1) / 2) + 'px'
      containerBackground.style.top = e.offsetY - Math.floor((containerBackground.clientHeight + 1) / 2) + 'px'
      this.mouseHovering = true
      this.changeBusy = true
      setTimeout(() => {
        this.changeBusy = false
      }, this.backgroundChangeTime * 1000)
    })
    container.addEventListener('mouseleave', (e) => {
      if (this.onMobile) return
      containerBackground.style.left = e.offsetX - Math.floor((containerBackground.clientWidth + 1) / 2) + 'px'
      containerBackground.style.top = e.offsetY - Math.floor((containerBackground.clientHeight + 1) / 2) + 'px'
      this.mouseHovering = false
      this.changeBusy = true
      setTimeout(() => {
        this.changeBusy = false
      }, this.backgroundChangeTime * 1000)
    })
  },
  methods: {
    changeMode () {
      this.loading = true
      this.$refs['loginForm'].resetFields()
      if (this.type === LOGIN) {
        this.type = REGISTER
        this.usernamePrompt = 'New username'
        this.passwordPrompt = 'New Password'
        this.registerButtonText = 'Login'
        this.registerPrompt = 'Already have an account?'
      } else {
        this.type = LOGIN
        this.usernamePrompt = 'Username'
        this.passwordPrompt = 'Password'
        this.registerButtonText = 'Register'
        this.registerPrompt = 'Don\'t have an account?'
      }
      let that = this
      setTimeout(function () {
        that.loading = false
      }, this.waitTime)
    },
    submit () {
      this.loading = true
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          if (this.type === LOGIN) {
            this.login(this.form.username, this.form.password)
          } else {
            this.register()
          }
        } else {
          this.loading = false
          return false
        }
      })
    },
    login (username, password) {
      axiosWrapper('/user/authenticate', 'post', null, {
        username: username,
        password: password
      }).then(data => {
        if (data.flag) {
          if (data.data.token) {
            this.$store.commit('SET_USER', '#' + data.data.visitorName)
            this.$store.commit('SET_TOKEN', data.data.token)
          } else {
            this.$store.commit('SET_USER', this.form.username)
            this.$store.commit('SET_TOKEN', data.data)
          }
          this.$router.push({name: 'lobby'})
        } else {
          this.$message.error('Login Failed! Please Check')
        }
        this.loading = false
      }).catch(e => {
        if (e) {
          this.loading = false
          this.$message.error('Server Error')
        }
      })
    },
    register () {
      axiosWrapper('/user/add', 'post', null, {
        username: this.form.username,
        password: this.form.password
      }).then(data => {
        if (data.flag) {
          this.$store.commit('SET_USER', this.form.username)
          this.$store.commit('SET_TOKEN', data.data)
          this.$message.success('Register Successful!')
          this.$router.push({name: 'lobby'})
        } else {
          this.$message.error(this.type + ' Failed!')
        }
        this.loading = false
      }).catch(e => {
        if (e) {
          this.loading = false
          this.$message.error('Server Error')
        }
      })
    },
    touristLogin () {
      this.login('', '')
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
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

.containerBackground {
  position: absolute;
  height: 96rem;
  width: 96rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
}

.containerBackgroundCircle {
  background-color: rgba(200, 200, 200, 0.5);
  border-radius: 50%;
}

.welcome {
  line-height: 13rem;
  color: white;
  font-size: 2rem;
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
  color: white;
  text-align: center;
  margin-bottom: 3rem;
}

.register span {
  color: #409EFF;
  cursor: pointer;
}

.register span:hover {
  color: #60BEFF;
}

@media (max-width: 48rem) {

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
