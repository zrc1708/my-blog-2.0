<template>
    <div id="app">
        <el-card class="card1" ref="card1">
            <div class="mymd">
                <el-button class="btnmd" @click="upload">保存</el-button>
                <el-input type="textarea" :rows="lineNum" v-model="me"></el-input>
            </div>
            <div class="markdown-body" v-html="mymd" v-highlight 
            :style="{'height':mymdheight+'px'}"></div>
        </el-card>
    </div>
</template>
<script>
import showdown from 'showdown'

export default {
    data() {
            return {
                me:'',
                lineNum:0,
                mymdheight:0
            }
        },
    created() {
        this.getme()
    },
    mounted () {
        //为文本输入框设置高度, 一行文字大概占用22.3像素
        this.lineNum = Math.floor(this.$refs.card1.$el.offsetHeight / 22)-2
        this.mymdheight = this.$refs.card1.$el.offsetHeight-50
    },
    computed: {
        mymd(){
            let converter = new showdown.Converter();
            return converter.makeHtml(this.me);
        }
    },
    methods: {
        // 获取自我介绍
        async getme() {
            const {data} = await this.$http.get(`getme`)
            if (data.code !== 200) return this.$message('登录失效')
            this.me = data.arr[0].content
        },
        // 保存
        async upload() {
            let me = this.me
            const {data} = await this.$http.post(`updateme`,{me})
            if (data.code !== 200) return this.$message('登录失效')
            this.$message.success('更新自我介绍成功')
        },
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