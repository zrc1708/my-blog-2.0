import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    articleId:'',
    getarticle:0,
    articleNum:0,
    labelNum:0,
    userName:'',
    userId:'',
    userBirthtime:''
  },
  mutations: {
    setArticleId(state,val){
      state.articleId = val
    },
    setArticleList(state){
      state.getarticle++
    },
    setArticleNum(state,val){
      state.articleNum = val
    },
    setlabelNum(state,val){
      state.labelNum = val
    },
    setUserName(state,val){
      state.userName = val
    },
    setUserId(state,val){
      state.userId = val
    },
    setUserBirthtime(state,val){
      state.userBirthtime = val
    }
  },
  actions: {
  },
  modules: {
  }
})
