 <template>
    <div>
        <el-card>
            <el-button class="btn" @click="backToAitlcle">返回文章列表</el-button>
            <el-table :data="userList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="content" label="内容" ></el-table-column>
                <el-table-column prop="recommend" label="类型" :filters="typeFilter" :filter-method="filterHandler">
                    <template slot-scope="scope">
                        {{scope.row.recommend==1?'推荐':'不推荐'}}
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="评论人" :filters="userFilter" :filter-method="filterHandler"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="deleteComment(scope.row)">删除</el-button>
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
    </div>
</template>
<script>
export default {
    data() {
        return {
            userList:'',
            // 总共的记录条数
            articleCount:0,
            // 总共的页数
            pageCount:0,
            // 当前的页码
            curPage:1,
            // 一页展示的记录数
            pageSize:10,
            // 类型过滤器
            typeFilter:[],
            // 用户过滤器
            userFilter:[]
        }
    },
    created() {
        this.countUser()
        this.getUserList(this.pageSize,this.curPage)
    },
    methods: {
        // 返回文章列表
        backToAitlcle(){
            this.$router.push(`/myarticle?curpage=${this.$route.query.oldpage}`)
        },
        // 获取文章评论总量
        async countUser(){
            const {data} = await this.$http.get(`getcommentcount/${this.$route.query.id}`)
            if (data.code !== 200) return this.$message('登录失效')
            this.articleCount = data.total
        },
        // 获取评论列表
        async getUserList(pageSize,curPage){
            const {data} = await this.$http.get(`getcomment/${this.$route.query.id}/${pageSize}/${curPage}`)
            if (data.code !== 200) return this.$message('登录失效')
            this.userList = data.arr
            let typeArr = []
            let userArr = []
            data.arr.forEach(file=>{
                typeArr.push(file.recommend)
                userArr.push(file.username)
            })
            typeArr = [...new Set(typeArr)];
            userArr = [...new Set(userArr)];
            this.typeFilter = []
            this.userFilter = []
            typeArr.forEach(type => {
                this.typeFilter.push({
                    text:type==1?'推荐':'不推荐',
                    value:type
                })
            });
            userArr.forEach(username => {
                this.userFilter.push({
                    text:username,
                    value:username
                })
            });
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        //删除评论 
        deleteComment(item){
            this.$confirm('此操作将删除该评论, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data} =  await this.$http.post(`deletecomment`,{id:item.id})
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.countUser()
                this.getUserList(this.pageSize,this.curPage)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        // 页码改变
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.curPage = val
            this.getUserList(this.pageSize,this.curPage)
        },
    },
}
</script>
<style lang="less" scoped>
.paper{
    text-align: center;
}
.btn{
    margin-bottom: 20px;
}
</style>