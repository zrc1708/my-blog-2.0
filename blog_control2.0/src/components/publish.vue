<template>
    <div id="app">
        <el-card v-show="step1" class="card1" ref="card1">
            <div class="mymd">
                <el-button class="btnmd" @click="next">下一步</el-button>
                <el-input type="textarea" :rows="lineNum" v-model="uploadArticle.content"></el-input>
            </div>
            <div class="markdown-body" v-html="mymd" v-highlight 
            :style="{'height':mymdheight+'px'}"></div>
        </el-card>
        <el-card v-show="!step1">
            <el-button @click="back">上一步</el-button>
            <el-button @click="upload()" :disabled="publishit?false:true">发表</el-button>
            <!-- 文章详细内容表单 -->
            <el-form ref="form" :model="form" label-width="100px" class="articleForm">
                <el-form-item label="文章标题：">
                    <el-input v-model="uploadArticle.title" class="changeInput"></el-input>
                </el-form-item>
                <el-form-item label="文章介绍：">
                    <el-input type="textarea" :rows="3" v-model="uploadArticle.detail" class="changeInput"></el-input>
                </el-form-item>
                <el-form-item label="发布时间：">
                    <el-input v-model="uploadArticle.datetime" :disabled="true" class="changeInput"></el-input>
                </el-form-item>
                <el-form-item label="文章分类：">
                    <el-select v-model="uploadArticle.sortid" placeholder="请选择分类">
                        <el-option v-for="(item, index) in sortList" :key="index" 
                        :label="item.sortname" :value="item.sortid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章标签：">
                    <el-select v-model="uploadArticle.labelid" placeholder="请选择标签" >
                        <el-option v-for="(item, index) in labelList" :key="index" 
                        :label="item.labelname" :value="item.labelid"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
import showdown from 'showdown'

export default {
    data() {
            return {
                uploadArticle:{
                    title:'',
                    detail:'',
                    datetime:'',
                    sortid:'',
                    labelid:'',
                    content:''
                },
                sortList:[],
                labelList:[],
                step1:true,
                lineNum:0,
                mymdheight:0
            }
        },
    created() {
        this.uploadArticle.datetime = this.getFormatDate()
        this.getSortList()
        this.getLabelList()

    },
    mounted () {
        //为文本输入框设置高度, 一行文字大概占用22.3像素
        this.lineNum = Math.floor(this.$refs.card1.$el.offsetHeight / 22)-2
        this.mymdheight = this.$refs.card1.$el.offsetHeight-50
    },
    computed: {
        publishit(){
            let list = Object.values(this.uploadArticle)
            // 只要数组有空就返回false
            let res = list.every(function(item,index,arr){
                  return item!=='';
             });
            return res
        },
        mymd(){
            let converter = new showdown.Converter();
            let md = this.uploadArticle.content.replace(/\'/g, "\"")
            return converter.makeHtml(md);
        }
    },
    methods: {
        // 发表文章
        async upload() {
            this.uploadArticle.content = this.uploadArticle.content.replace(/\'/g, "\"")
            const {data} = await this.$http.post(`publisharticle`,this.uploadArticle)
            console.log(data)
            if (data.code !== 200) return this.$message('登录失效')
            this.$message.success('发表成功')
            // 置空对象
            this.uploadArticle={
                    title:'',
                    detail:'',
                    datetime:this.getFormatDate(),
                    sortid:'',
                    labelid:'',
                    content:''
                }
        },
        // 获取当前时间
        getFormatDate() {
            var date = new Date();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentDate = date.getFullYear() + "-" + month + "-" + strDate
                    + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            return currentDate;
        },
        // 获取分类列表
        async getSortList(){
            const {data} = await this.$http.get(`getAllSorts`)
            this.sortList = data.arr
        },
        // 获取标签列表
        async getLabelList(){
            const {data} = await this.$http.get(`getAllLabels`)
            this.labelList = data.arr
        },
        // 下一步
        next(){
            this.step1 = false
        },
        // 上一步
        back(){
            this.step1 = true
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
    span{
        padding-left: 20px;
        padding-right: 20px;
    }
    #flieinput { 
        opacity: 0;
        transform: translateY(-200px);
    }
    .articleForm{
        padding-top: 20px;
    }
    .changeInput{
        max-width: 500px;
    }
</style>