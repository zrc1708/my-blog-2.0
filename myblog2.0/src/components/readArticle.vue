<template>
    <div>
        <div id="app">
            <div class="markdown-body" v-html="html" v-highlight></div>
        </div>
        <div id="comment" v-if="$store.state.userId">
            <div class="title">
                <span>评论</span>
                <label>
                    <input type="radio" name="comment" value="1" v-model="commitRadio">
                    <span>推荐</span>
                </label>
                <label>
                    <input type="radio" name="comment" value="0" v-model="commitRadio">
                    <span>不推荐</span>
                </label>
                <span class="publishbutton" @click="publish">发表</span>
            </div>
            <textarea type="text" class="my-input comment" placeholder="说点什么吧" v-model="commitText"></textarea>
        </div>
        <!-- 评论分析 -->
        <div class="comment-analyse" v-show="articleCount!=0">
            <span class="comment-span">
                评论数：<span>{{articleCount}}</span>
            </span>
            <span class="comment-span">
                好评数：<span>{{recommendCount}}</span>
            </span>
            <span class="comment-span">
                好评率：<span>{{recommendPercentage}}%</span>
            </span>
        </div>
        <!-- 评论列表 -->
        <my-commentLine v-for="comment in commentsArr" :key="comment" :comment='comment'></my-commentLine>
        <!-- 评论分页 -->
        <div class="page" v-if="pageCount<=7&&pageflag&&articleCount!=0">
            <div class="pagebox" @click="changePageBtn($event)"
            :class="{'cantclick':curPage===1}">&lt;</div>

            <div class="pagebox" v-for="(item, index) in pageCount" :key="index"
            :class="{'choosedPage':item===curPage}"
            @click="changePage(item)">{{item}}</div>
            
            <div class="pagebox" @click="changePageBtn($event)"
            :class="{'cantclick':curPage===pageCount}">&gt;</div>
        </div>
        <div class="page" v-if="pageCount>7&&pageflag&&articleCount!=0">
            <div class="pagebox" @click="changePageBtn($event)"
            :class="{'cantclick':curPage===1}">&lt;</div>

            <div class="pagebox" :class="{'choosedPage':pageCount2-3===curPage}"
            @click="changePage2(pageCount2-3)">{{pageCount2-3}}</div>
            <div class="pagebox" :class="{'choosedPage':pageCount2-2===curPage}"
            @click="changePage2(pageCount2-2)">{{pageCount2-2}}</div>
            <div class="pagebox" :class="{'choosedPage':pageCount2-1===curPage}"
            @click="changePage2(pageCount2-1)">{{pageCount2-1}}</div>
            <div class="pagebox" :class="{'choosedPage':pageCount2===curPage}"
            @click="changePage2(pageCount2)">{{pageCount2}}</div>
            <div class="pagebox" :class="{'choosedPage':pageCount2+1===curPage}"
            @click="changePage2(pageCount2+1)">{{pageCount2+1}}</div>
            <div class="pagebox" :class="{'choosedPage':pageCount2+2===curPage}"
            @click="changePage2(pageCount2+2)">{{pageCount2+2}}</div>
            <div class="pagebox" :class="{'choosedPage':pageCount2+3===curPage}"
            @click="changePage2(pageCount2+3)">{{pageCount2+3}}</div>
            
            <div class="pagebox" @click="changePageBtn($event)"
            :class="{'cantclick':curPage===pageCount}">&gt;</div>
        </div>
    </div>
</template>
<script>
import showdown from 'showdown'
import commentLine from './commentLine.vue'

export default {
    data() {
        return {
            html:'',
            commitRadio:'1',
            commitText:'',
            commentsArr:[],
            // 总共的记录条数
            articleCount:0,
            // 总共的页数
            pageCount:0,
            // 页码较多时渲染用页数
            pageCount2:4,
            // 当前的页码
            curPage:1,
            // 一页展示的记录数
            pageSize:5,
            pageflag:true,
            // 好评数
            recommendCount:0
        }
    },
    components:{
        'my-commentLine':commentLine
    },
    created() {
        let data=window.location.href;
        let id=data.split("?articleid=")[1];
        this.getmd(decodeURIComponent(id))
        this.getCommentsCount()
        this.getComments(this.pageSize,this.curPage)
    },
    computed:{
        recommendPercentage(){
            let num = this.recommendCount/this.articleCount
            return num.toFixed(2)*100
        }
    },
    methods: {
        async getmd(id){
            let converter = new showdown.Converter();
            let {data} = await this.$http.get(`/readarticle/${id}`)
            this.html = converter.makeHtml(data.arr[0].content);
        },
        // 发表评论
        async publish(){
            const data = {
                recommend:this.commitRadio,
                content:this.commitText,
                userid:this.$store.state.userId,
                articleid:this.$route.query.articleid
            }
            let {data:res} = await this.$http.post(`/publishcomment`,data)
            if(res.code==200){
                alert('评论成功')
                this.commitRadio = '1'
                this.commitText = ''

                this.getCommentsCount()
                this.curPage = 1
                this.getComments(this.pageSize,this.curPage)
            }else{
                alert('评论失败')
            }
        },
        // 获取评论数量
        async getCommentsCount(){
            const {data} = await this.$http.get(`/getcommentcount/${this.$route.query.articleid}`)
            // 获取好评数，用以统计评论信息
            this.recommendCount = data.recommend
            // 获取数据总数，用以分页
            let count = data.total
            this.articleCount = count
            this.pageCount =  Math.ceil(count/this.pageSize)
        },
        // 获取评论
        async getComments(pageSize,curPage){
            let {data:res} = await this.$http.get(`/getcomment/${this.$route.query.articleid}/${pageSize}/${curPage}`)
            if(res.code==200){
                this.commentsArr = res.arr
            }
        },
        // 左右两侧的分页按钮
        changePageBtn(e){
            let flag = e.target.innerHTML
            if(flag=='&lt;'){
                this.curPage--
            }else{
                this.curPage++
            }
            this.getComments(this.pageSize,this.curPage)
        },
        // 切换页码
        changePage(num){
            this.curPage = num
            this.getComments(this.pageSize,this.curPage)
        },
        // 总页码较多时改变页码按钮
        changePage2(num){
            if(num>this.pageCount2&&num<=this.pageCount-3){
                this.pageCount2 = num
            }else if(num<this.pageCount2&&num>=3){
                this.pageCount2 = num
            }
            this.curPage = num
            this.getComments(this.pageSize,this.curPage)
        }
    },
}
</script>

<style lang="less" scoped>
@import "../assets/css/md.css";
    #app{
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        background-color: white;
        border-radius: 10px;
        box-sizing: border-box;
        box-shadow:0px 2px 6px 4px #f5f5f5;
        padding: 20px;
    }
    #comment{
        font-size: 16px;
        margin-top: 20px;
        background-color: white;
        border-radius: 10px;
        box-sizing: border-box;
        box-shadow:0px 2px 6px 4px #f5f5f5;
        padding: 20px;
    }
    .title{

        margin-bottom: 20px;
        span{
                vertical-align: middle;
            }
        label{
            cursor: pointer;
            margin-left: 1em;
            vertical-align: middle;
            input{
                vertical-align: middle;
            }
            span{
                margin-left: 5px;
            }
        }
        .publishbutton{
            float: right;
            border: 1px solid #dcdfe6;
            color: #606266;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;

            &:hover,&:focus {
                color: #409eff;
                border-color: #c6e2ff;
                background-color: #ecf5ff;
            }
            &:active {
                color: #3a8ee6;
                border-color: #3a8ee6;
                outline: none;
}
        }
    }
    .comment{
        width: 100%;
        padding: 15px;
        height: 100px;
    }
    .comment-analyse{
        font-size: 16px;
        margin-top: 20px;
        background-color: white;
        border-radius: 10px;
        box-sizing: border-box;
        box-shadow:0px 2px 6px 4px #f5f5f5;
        padding: 20px;
        
        .comment-span{
            margin-right: 20px;
            span{
                color: #409eff;
            }
        }
    }
    .page{
       display: flex;
       align-content: center;
       justify-content: center;
       margin-bottom: 2em;
       margin-top: 2em;
       .pagebox{
            cursor: pointer;
            margin: 0 10px;
            box-shadow:0px 2px 15px 4px #eeeeee;
            background-color: white;
            border-radius: 5px;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
       }
       .choosedPage{
           background-color: #409eff;
           color: white;
       }
       .cantclick{
           color: #e8e9ed;
           pointer-events:none;
           cursor:not-allowed;
       }
   }
</style>