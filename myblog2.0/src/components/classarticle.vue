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
        let url=window.location.href;
        let data = url.split('?')[1]
        let category = data.split("&")[0].split("=")[1];
        let name = data.split("&")[1].split("=")[1];
        this.getarticle(category,name)
    },
    methods: {
        async getarticle(category,name){
            let {data} = await this.$http.get(`getlist/${category}/${name}`)
            if(data.code!==200){
                console.log('获取失败');
                return
            }
            this.articleList = data.arr
        }
    },
    watch:{
        $route(to,from){
            let url = to.fullPath
            let data = url.split('?')[1]
            let category = decodeURIComponent(data.split("&")[0].split("=")[1]);
            let name = decodeURIComponent(data.split("&")[1].split("=")[1]);
            this.getarticle(category,name)
        }
    },
    components:{
        'my-article':myarticle
    },
}
</script>
<style lang="less" scoped>
   
</style>