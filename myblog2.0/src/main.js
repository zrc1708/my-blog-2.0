import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '../src/assets/css/global.css'
// import '../src/assets/css/font-awesome.min.css'

import Cookies from 'js-cookie'
Vue.prototype.$cookie = Cookies

// import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:8877/'
axios.defaults.baseURL = '/api'
Vue.prototype.$http = axios

Vue.config.productionTip = false

import '../src/assets/css/atom-one-dark.css'

Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
