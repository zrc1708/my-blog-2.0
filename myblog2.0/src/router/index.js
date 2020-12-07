import Vue from 'vue'
import VueRouter from 'vue-router'

import articleList from '../components/articleList.vue'
import readarticle from '../components/readArticle.vue'
import allarticle from '../components/allarticle.vue'
import me from '../components/me.vue'
import search from '../components/search.vue'
import clarticle from '../components/classarticle.vue'

Vue.use(VueRouter)

  const routes = [
    {path:'/',redirect:'/articlelist'},
    {path:'/articlelist',component:articleList},
    {path:'/readarticle',component:readarticle},
    {path:'/allarticle',component:allarticle},
    {path:'/me',component:me},
    {path:'/search',component:search},
    {path:'/clarticle',component:clarticle}
  ]

const router = new VueRouter({
  routes
})

export default router
