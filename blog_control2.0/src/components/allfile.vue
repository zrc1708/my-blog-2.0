 <template>
    <div>
        <el-card>
            <a style="display: none;" href="" ref="a" target="_self"></a>
            <el-table :data="filesList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="文件名" ></el-table-column>
                <el-table-column prop="type" label="类型"
                :filters="filesFilter" :filter-method="filterHandler"></el-table-column>
                <el-table-column prop="size" label="大小"></el-table-column>
                <el-table-column prop="code" label="提取码"></el-table-column>
                <el-table-column prop="username" label="所属用户"
                :filters="userFilter" :filter-method="filterHandler"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="deleteFile(scope.row)" >删除</el-button>
                        <el-button size="mini" @click="download(scope.row)" >下载</el-button>
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
            filesList:[],
            // 总共的记录条数
            articleCount:0,
            // 总共的页数
            pageCount:0,
            // 当前的页码
            curPage:1,
            // 一页展示的记录数
            pageSize:10,
            // 文件类型过滤器
            filesFilter:[],
            // 所属用户过滤器
            userFilter:[]
        }
    },
    created() {
        this.getFilesCount()
        this.getFilesList(this.pageSize,this.curPage)
    },
    filters: {
        
    },
    methods: {
        // 获取数据总量
        async getFilesCount(){
            const {data} = await this.$http.get(`getallfilescount`)
            if (data.code !== 200) return this.$message('登录失效')
            this.articleCount = data.rs[0]['count(*)']
        },
        // 获取文件列表
        async getFilesList(pageSize,curPage){
            const {data} = await this.$http.get(`getallfilesbysql/${pageSize}/${curPage}`)
            if (data.code !== 200) return this.$message('登录失效')
            let typeArr = []
            let userArr = []
            data.rs.forEach(file=>{
                typeArr.push(file.type)
                userArr.push(file.username)
            })
            typeArr = [...new Set(typeArr)];
            userArr = [...new Set(userArr)];
            this.filesFilter = []
            this.userFilter = []
            typeArr.forEach(type => {
                this.filesFilter.push({
                    text:type,
                    value:type
                })
            });
            userArr.forEach(username => {
                this.userFilter.push({
                    text:username,
                    value:username
                })
            });
            this.filesList = data.rs
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        // 页码改变
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.curPage = val
            this.getFilesList(this.pageSize,this.curPage)
        },
        // 删除文件
        async deleteFile(file){
            this.$confirm('此操作将删除此文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data} = await this.$http.post(`admdeletefile`,{
                    path:file.path,
                    id:file.id
                })
                if (data.code !== 200) return this.$message('登录失效')
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getFilesList(this.pageSize,this.curPage)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        // 下载文件
        async download(file){
            let {data:res} = await this.$http.post('/getfilebycode',{code:file.code})
            if(res.code==200){
                this.$confirm(`确定要下载${file.name}?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let a = this.$refs.a
                    a.setAttribute('href', `http://127.0.0.1:8877/downloadfile?path=${res.rs[0].path}&name=${res.rs[0].name}`)
                    a.setAttribute('download', `${res.rs[0].name}`)
                    a.click()
                }).catch(() => {});
                
            }
        }
    },
}
</script>
<style lang="less" scoped>
.paper{
    text-align: center;
}
</style>