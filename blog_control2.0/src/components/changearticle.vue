<template>
    <div id="app">
        <el-card class="card1" ref="card1">
            <div class="mymd">
                <el-button class="btnmd" @click="upload">保存</el-button>
                <el-button class="btnmd" @click="goback">返回</el-button>
                <el-input type="textarea" :rows="lineNum" v-model="article"></el-input>
            </div>
            <div class="markdown-body" v-html="articlemd" v-highlight 
            :style="{'height':mymdheight+'px'}"></div>
        </el-card>
    </div>
</template>
<script>
import showdown from 'showdown'

export default {
    data() {
            return {
                id:0,
                article:'',
                // articlemd:'',
                lineNum:0,
                mymdheight:0
            }
        },
    created() {
        let data=window.location.href;
        let id=data.split("?id=")[1];
        this.id = id
        this.getmd(decodeURIComponent(id))
    },
    mounted () {
        //为文本输入框设置高度, 一行文字大概占用22.3像素
        this.lineNum = Math.floor(this.$refs.card1.$el.offsetHeight / 22)-2
        this.mymdheight = this.$refs.card1.$el.offsetHeight-50
    },
    computed: {
        articlemd(){
            let converter = new showdown.Converter();
            return converter.makeHtml(this.article);
        }
    },
    methods: {
        // 获取文章
        async getmd(id){
            let converter = new showdown.Converter();
            let {data} = await this.$http.get(`/readarticle/${id}`)
            this.article = data.arr[0].content
        },
        // 保存修改
        async upload() {
            let content = this.article
            let id = this.id
            const {data} = await this.$http.post(`updateArticles`,{id,content})
            if (data.code !== 200) return this.$message('登录失效')
            this.$message.success('更新文章成功')
        },
        // 返回
        goback(){
            this.$router.push('/myarticle')
        }
    },
}
</script>
<style lang="less" scoped>
@import "../assets/css/md.css";
    #app{
        height: 100%;
        overflow: hidden;
    }
    // md实时编辑
    .card1{
        height: 100%;
    }
    .btnmd{
        margin-bottom: 15px;
    }
</style>