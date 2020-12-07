<template>
    <div id="app">
        <div class="nothing" v-if="noarticle">
            抱歉，没有此类文章
        </div>
        <my-article v-for="(item, index) in articleList" :key="index" :article='item' ></my-article>
    </div>
</template>
<script>
import myarticle from './article.vue'

export default {
    data () {
        return {
            articleList:[],
            noarticle:false
        }
    },
    created () {
        let data=window.location.href;
        let title=data.split("?searchtitle=")[1];
        this.searchArticle(decodeURIComponent(title))
    },
    methods: {
        // 模糊查询
        async searchArticle(title){
            this.articleList = []
            let {data} = await this.$http.post(`searchArticles`,{title})
            if(data.code!==200){
                this.$http.message('查询失败')
                return
            }
            if(data.arr.length===0){
                return this.noarticle = true
            }else{
                this.noarticle = false
                this.articleList = data.arr
            }
        }
    },
    watch:{
        $route(to,from){
            if(to.query.searchtitle!=from.query.searchtitle){
                this.searchArticle(to.query.searchtitle)
            }
        }
    },
    components:{
        'my-article':myarticle
    }
}
</script>
<style lang="less" scoped>
.nothing{
    text-align: center;
    font-size: 20px;
    color: #565a5f;
}
</style>