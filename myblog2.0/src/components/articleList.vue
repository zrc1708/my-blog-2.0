<template>
    <div id="app">
        <my-article v-for="(item, index) in articleList" :key="index" :article='item' ></my-article>
    </div>
</template>
<script>
import myarticle from './article.vue'

export default {
    data() {
        return {
            articleList:[]
        }
    },
    created() {
        this.getArticleList()
    },
    methods: {
        async getArticleList(){
            let {data} = await this.$http.get(`getArticles`)
            if(data.code!==200){
                console.log(获取失败);
                return
            }
            this.articleList = data.arr
        }
    },
    components:{
        'my-article':myarticle
    },
    watch:{
    '$store.state.getarticle':async function(newFlag, oldFlag){
        this.getArticleList()
    }
  }
}
</script>
<style lang="less" scoped>
   
</style>