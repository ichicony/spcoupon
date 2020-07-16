// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.prototype.$axios = axios;
// if (process.env.NODE_ENV === "'dev'"){
//   axios.defaults.baseURL = 'api'
// } else {
//   axios.defaults.baseURL = 'http://172.28.1.164/cunponapi/api/'
// }
// axios.defaults.baseURL = '/api' 
axios.defaults.baseURL=process.env.API_URL

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import util from './util'
Vue.prototype.$utils = util // main.js中全局引入

import uuid from 'uuid/v1'
Vue.prototype.$uuid=uuid

//
import wx from 'weixin-jsapi'
Vue.prototype.wx=wx;

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
