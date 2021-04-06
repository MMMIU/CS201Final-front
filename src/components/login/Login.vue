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
          <el-input v-show="showConfirmInput" type="password" placeholder="Confirm Password" v-model="password" style="margin-top: 1rem"
                    show-password></el-input>
          <el-button type="primary" :disabled="loginButtonEnabled" style="width: 100%;margin-top: 1rem" @click="login">{{ type }}
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
import {axiosWrapper} from '../../http/index'
const LOGIN = 'login'
const REGISTER = 'register'
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
      type: LOGIN,
      loginButtonEnabled: false,
      loading: false,
      showConfirmInput: false
    }
  },
  created () {
    window.addEventListener('resize', () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    })
  },
  mounted: function () {
    // if (document.body.clientWidth > 768) {
    //   let that = this
    //   that.timer = setInterval(function () {
    //     that.createRainDrop()
    //   }, 500)
    // }
  },
  watch: {
    // screenWidth (val) {
    //   if (val <= 768 && this.timer) {
    //     clearInterval(this.timer)
    //     this.timer = null
    //   } else if (val > 768 && !this.timer) {
    //     let that = this
    //     that.timer = setInterval(function () {
    //       that.createRainDrop()
    //     }, 500)
    //   }
    // }
  },
  methods: {
    changeMode () {
      this.loading = true
      if (this.type === LOGIN) {
        this.type = REGISTER
        this.usernamePrompt = 'New Username'
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
      }, 500)
    },
    login () {
      axiosWrapper('/logincheck', 'post', {user: this.username, password: this.password}).then(data => {
        console.log(data)
        this.$store.commit('SET_TOKEN', data.data.token)
        this.$store.commit('SET_USER', data.data.user)
        this.$message.success('login Success!')
        clearInterval(this.timer)
        this.$router.push({name: 'lobby'})
      }).catch(e => {
        if (e) {
          this.$message.error(this.type + ' Failed!')
        }
      }, 'post')
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

/*.login, .container::after {*/
/*  background-image: url("/static/images/login/ganyu.jpg");*/
/*  background-repeat: no-repeat;*/
/*  background-position: right;*/
/*  background-size: cover;*/
/*  background-attachment: fixed;*/
/*}*/

/*.container::after {*/
/*  content: '';*/
/*  position: absolute;*/
/*  margin: -2rem;*/
/*  top: 0;*/
/*  left: 0;*/
/*  right: 0;*/
/*  bottom: 0;*/
/*  z-index: -1;*/
/*  filter: blur(1.3rem);*/
/*}*/

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
