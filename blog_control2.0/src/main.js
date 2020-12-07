import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '../src/assets/css/global.css'

// 导入axios
import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8877/'
Vue.prototype.$http = axios

axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

import '../src/assets/css/atom-one-dark.css'

// 代码高亮
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
