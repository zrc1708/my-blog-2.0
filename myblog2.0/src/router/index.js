import Vue from 'vue'
import VueRouter from 'vue-router'

import articleList from '../components/articleList.vue'
import readarticle from '../components/readArticle.vue'
import allarticle from '../components/allarticle.vue'
import me from '../components/me.vue'
import search from '../components/search.vue'
import clarticle from '../components/classarticle.vue'
import blog from '../views/blog.vue'
import login from '../views/login.vue'
import files from '../views/files.vue'
import userspace from '../components/userspace.vue'
import error from '../components/error.vue'

import store from '../store'

Vue.use(VueRouter)

  const routes = [
    {path:'/login',component:login},
    {path:'/',redirect:'/blog/articlelist'},
    {path:'/blog',component:blog, children:[
      {path:'/blog/articlelist',component:articleList},
      {path:'/blog/readarticle',component:readarticle},
      {path:'/blog/allarticle',component:allarticle},
      {path:'/blog/me',component:me},
      {path:'/blog/search',component:search},
      {path:'/blog/clarticle',component:clarticle},
      {path:'/blog/filebox',component:files},
      {path:'/blog/userspace',component:userspace},
      {path:'/blog/error',component:error},
    ]},
  ]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(
    (to.path=='/blog/filebox'||to.path=='/blog/userspace')&&(!store.state.userId)
  ){
    next('/blog/error')
  }else{
    next()
  }
})

export default router
