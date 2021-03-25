 <template>
    <div>
        <el-card>
            <el-table :data="userList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="用户名" ></el-table-column>
                <el-table-column prop="logintime" label="登录时间">
                    <template slot-scope="scope">
                        {{scope.row.logintime | toMyDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="birthtime" label="注册时间">
                    <template slot-scope="scope">
                        {{scope.row.birthtime | toMyDate}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row.state==0?'正常':'封禁'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="deleteUser(scope.row)" v-if="scope.row.state==0">封禁</el-button>
                        <el-button size="mini" @click="changeUser(scope.row)" v-else>解封</el-button>
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
import moment from 'moment'

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
        }
    },
    created() {
        this.countUser()
        this.getUserList(this.pageSize,this.curPage)
    },
    filters:{
        toMyDate(value){
            return moment(value).format("YYYY-MM-DD HH:mm:ss")
        }
    },
    methods: {
        // 获取用户总量
        async countUser(){
            const {data} = await this.$http.get(`getalluserscount`)
            if (data.code !== 200) return this.$message('登录失效')
            this.articleCount = data.rs[0]['count(*)']-1
        },
        // 获取用户列表
        async getUserList(pageSize,curPage){
            const {data} = await this.$http.get(`getalluser/${pageSize}/${curPage}`)
            if (data.code !== 200) return this.$message('登录失效')
            this.userList = data.arr
        },
        //封禁用户 
        deleteUser(item){
            this.$confirm('此操作将封禁该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data} =  await this.$http.post(`deleteuser`,{userid:item.id})
                this.$message({
                    type: 'success',
                    message: '封禁成功!'
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
        // 解封用户
        changeUser(item){
            this.$confirm('此操作将解封该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data} =  await this.$http.post(`changeuser`,{userid:item.id})
                this.$message({
                    type: 'success',
                    message: '解封成功!'
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
</style>