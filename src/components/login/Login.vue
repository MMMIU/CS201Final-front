<template>
  <div class="login">
    <div  class="container">
      <el-container id="loginContainer" v-loading="loading" class="userEnter" element-loading-background="rgba(250, 250, 250, 0.8)">
        <el-header height="13rem" class="welcome">
          {{ type | upperCase }}
        </el-header>
        <el-main style="width: 80%">
          <el-form>
            <el-form-item>
              <el-input v-model="ruleForm.username" :placeholder="usernamePrompt"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" :placeholder="passwordPrompt" v-model="ruleForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <el-input v-if="type==='register'" type="password" placeholder="Confirm Password" v-model="checkPassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" :disabled="loginButtonEnabled"  @click="login" style="width: 100%
">{{ type | upperCase}}</el-button>
            </el-form-item>
          </el-form>
        </el-main>
        <el-footer class="register">{{registerPrompt}}
          <span @click="changeMode">{{registerButtonText}}</span>
        </el-footer>
      </el-container>
      <div id="containerBackground" class="containerBackground">
        <div id = "containerBackgroundCircle" class="containerBackgroundCircle" :style="{width: mouseHovering?'100%':0, height: mouseHovering?'100%':0}"></div>
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
        callback(new Error('请输入密码'))
      } else {
        if (this.checkPassword !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      screenWidth: document.body.clientWidth,
      usernamePrompt: 'username',
      passwordPrompt: 'Password',
      registerPrompt: 'Don\'t have an account?',
      registerButtonText: 'Register',
      type: LOGIN,
      ruleForm: {
        username: '',
        password: ''
      },
      checkPassword: '',
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      loginButtonEnabled: false,
      loading: false,
      showConfirmInput: true,
      waitTime: 500,
      mouseHovering: false,
      backgroundChangeTime: 0.5,
      changeBusy: false,
      onMobile: (document.body.clientWidth <= this.MOBILE)
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
      this.loading = true
      axiosWrapper('/logincheck', 'post', {form: this.ruleForm}).then(data => {
        this.$store.commit('SET_TOKEN', data.data.token)
        this.$store.commit('SET_USER', data.data.username)
        this.$message.success('login Success!')
        this.$router.push({name: 'lobby'})
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

.containerBackground{
  position: absolute;
  height: 96rem;
  width: 96rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
}

.containerBackgroundCircle{
  background-color: rgba(200,200,200,0.5);
  border-radius: 50%;
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
