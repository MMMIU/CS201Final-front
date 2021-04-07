// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import store from './store'
import global from './global'
import {twoDecimal} from './filters/index'
Vue.prototype.MOBILE = global.MOBILE
// main.js
require('./mock')

Vue.use(Vuex)
Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.filter('twoDecimal', twoDecimal)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
