<template>
    <div id="app">
        <my-article v-for="(item, index) in articleList" :key="index" :article='item' ></my-article>
        <div class="page" v-if="pageCount<=7&&pageflag">
            <div class="pagebox" @click="changePageBtn($event)"
            :class="{'cantclick':curPage===1}">&lt;</div>

            <div class="pagebox" v-for="(item, index) in pageCount" :key="index"
            :class="{'choosedPage':item===curPage}"
            @click="changePage(item)">{{item}}</div>
            
            <div class="pagebox" @click="changePageBtn($event)"
            :class="{'cantclick':curPage===pageCount}">&gt;</div>
        </div>
        <div class="page" v-if="pageCount>7&&pageflag">
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
import myarticle from './article.vue'

export default {
    data() {
        return {
            // 文章列表
            articleList:[],
            // 总共的记录条数
            articleCount:0,
            // 总共的页数
            pageCount:0,
            // 页码较多时渲染用页数
            pageCount2:4,
            // 当前的页码
            curPage:1,
            // 一页展示的记录数
            pageSize:7,
            pageflag:true
        }
    },
    created() {
        this.getArticleList(this.pageSize,this.curPage)
        this.getArticlesCount()
    },
    computed: {
        
    },
    methods: {
        // 获取文章列表
        async getArticleList(pageSize,curPage){
            let {data} = await this.$http.get(`getPagingArticles/${pageSize}/${curPage}`)
            if(data.code!==200){
                console.log('获取失败');
                return
            }
            this.articleList = data.arr
        },
        // 获取文章数量
         async getArticlesCount(){
            const {data} = await this.$http.get(`getArticlesCount`)
            if (data.code !== 200) return this.$message('登录后方可使用此功能')
            let count = data.arr[0]['count(*)']
            this.articleCount = count
            this.pageCount =  Math.ceil(count/this.pageSize)
        },
        // 左右两侧的分页按钮
        changePageBtn(e){
            let flag = e.target.innerHTML
            if(flag=='&lt;'){
                this.curPage--
            }else{
                this.curPage++
            }
            this.getArticleList(this.pageSize,this.curPage)
        },
        // 切换页码
        changePage(num){
            this.curPage = num
            this.getArticleList(this.pageSize,this.curPage)
        },
        // 总页码较多时改变页码按钮
        changePage2(num){
            if(num>this.pageCount2&&num<=this.pageCount-3){
                this.pageCount2 = num
            }else if(num<this.pageCount2&&num>=3){
                this.pageCount2 = num
            }
            this.curPage = num
            this.getArticleList(this.pageSize,this.curPage)
        }
    },
    components:{
        'my-article':myarticle
    },
     watch:{
    '$store.state.getarticle':async function(newFlag, oldFlag){
        this.getArticleList(this.pageSize,this.curPage)
        this.pageflag = true
    }
  }
}
</script>
<style lang="less" scoped>
   .page{
       display: flex;
       align-content: center;
       justify-content: center;
       margin-bottom: 20px;
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