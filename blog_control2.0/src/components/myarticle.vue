<template>
    <div>
        <el-card>
            <!-- 文件列表 -->
            <el-table :data="articleList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="title" label="文章名" ></el-table-column>
                <el-table-column label="发表日期" >
                    <template slot-scope="scope">
                        {{scope.row.date.split('T')[0]}}
                    </template>
                </el-table-column>
                <el-table-column prop="detail" label="文章介绍" ></el-table-column>
                <el-table-column prop="sortname" label="文章分类" 
                :filters="sortFilterList"
                :filter-method="Filter"></el-table-column>
                <el-table-column prop="labelname" label="文章标签"
                :filters="labelFilterList"
                :filter-method="Filter" ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="openchange(scope.row)">修改信息</el-button>
                        <el-button size="mini" @click="change(scope.row)">修改文章</el-button>
                        <el-button size="mini" @click="opendelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <div class="paper">
                <el-pagination layout="prev, pager, next" 
                :total="articleCount"
                :page-size="pageSize"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </el-card>
        <!-- 修改文件对话框 -->
        <el-dialog title="文章修改" :visible.sync="changeDialogVisible" width="30%" class="card">
            <el-form ref="form" :model="form" label-width="25%">
                <el-form-item label="文章标题：">
                    <el-input v-model="changed.title" placeholder="文章标题" class="changeInput"></el-input>
                </el-form-item>
                <el-form-item label="发表日期：">
                    <el-input v-model="newDate" :disabled="true" class="changeInput"></el-input>
                </el-form-item>
                <el-form-item label="文章分类：">
                    <el-select v-model="changed.sortname" placeholder="请选择分类">
                        <el-option v-for="(item, index) in sortList" :key="index" 
                        :label="item.sortname" :value="item.sortid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章标签：">
                    <el-select v-model="changed.labelname" placeholder="请选择标签" >
                        <el-option v-for="(item, index) in labelList" :key="index" 
                        :label="item.labelname" :value="item.labelid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章介绍：">
                    <el-input type="textarea" :rows="3" v-model="changed.detail" class="changeTextArea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeArticle">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            articleList:[],
            // 总共的记录条数
            articleCount:0,
            // 总共的页数
            pageCount:0,
            // 当前的页码
            curPage:1,
            // 一页展示的记录数
            pageSize:10,
            sortList:[],
            labelList:[],
            changeDialogVisible:false,
            changed:{date:''},
            sortFilterList:[],
            labelFilterList:[]
        }
    },
    computed: {
        newDate(){
            return this.changed.date.split('T')[0]
        }
    },
    created() {
        this.getArticles(this.pageSize,this.curPage)
        this.getArticlesCount()
        this.getSortList()
        this.getLabelList()
    },
    methods: {
        // 获取文章列表
        async getArticles(pageSize,curPage){
            const {data} = await this.$http.get(`getPagingArticles/${pageSize}/${curPage}`)
            if (data.code !== 200) return this.$message('登录后方可使用此功能')
            // console.log(data);
            this.articleList = data.arr
        },
        // 获取文章数量
        async getArticlesCount(){
            const {data} = await this.$http.get(`getArticlesCount`)
            if (data.code !== 200) return this.$message('登录后方可使用此功能')
            let count = data.arr[0]['count(*)']
            this.articleCount = count
            this.pageCount =  Math.ceil(count/this.pageSize)
            // console.log(this.articleCount);
        },
        // 获取分类列表
        async getSortList(){
            const {data} = await this.$http.get(`getAllSorts`)
            // if (data.code !== 200) return this.$message('登录后方可使用此功能')
            this.sortList = data.arr
            // 将sort数据存入过滤器
            let arr = []
            for(let i=0;i<this.sortList.length;i++){
                let obj = {}
                obj.text = this.sortList[i].sortname
                obj.value = this.sortList[i].sortname
                arr.push(obj)
            }
            this.sortFilterList = arr
        },
        // 获取标签列表
        async getLabelList(){
            const {data} = await this.$http.get(`getAllLabels`)
            // if (data.code !== 200) return this.$message('登录后方可使用此功能')
            this.labelList = data.arr
            // 将label数据存入过滤器
            let arr = []
            for(let i=0;i<this.labelList.length;i++){
                let obj = {}
                obj.text = this.labelList[i].labelname
                obj.value = this.labelList[i].labelname
                arr.push(obj)
            }
            this.labelFilterList = arr
        },
        // 打开修改文件对话框
        openchange(item){
            this.changeDialogVisible = true
            this.changed = JSON.parse( JSON.stringify(item))
        },
        // 确认修改
        async changeArticle(){
            this.changeDialogVisible = false
            const {data} = await this.$http.post(`changeArticle`,this.changed)
            if (data.code !== 200) return this.$message('登录后方可使用此功能')
            // console.log(this.changed);
            this.$message.success('修改成功')
            this.getArticles(this.pageSize,this.curPage)
        },
        //打开删除确认框 
        opendelete(item){
            this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data} =  await this.$http.post(`deleteArticles`,item)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getArticles(this.pageSize,this.curPage)
                this.getArticlesCount()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 分类筛选
        Filter(value, row ,column){
            const property = column['property'];
            return row[property] === value;
        },
        // 页码改变
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.curPage = val
            this.getArticles(this.pageSize,this.curPage)
        },
        // 修改文章
        change(item){
            this.$router.push(`/changearticle?id=${item.id}`)
        }
    },
}
</script>
<style lang="less" scoped>
.changeInput{
    display: block!important;
    width: 80%!important;
}
.changeTextArea {
    width: 80%!important;
}
.paper{
    padding-top: 20px;
    text-align: center;
}
</style>