 <template>
    <div>
        <el-card>
            <el-table :data="userList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="用户名" ></el-table-column>
                <el-table-column prop="logintime" label="登录时间"></el-table-column>
                <el-table-column prop="birthtime" label="注册时间"></el-table-column>
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
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userList:''
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取用户列表
        async getUserList(){
            const {data} = await this.$http.get(`getalluser`)
            if (data.code !== 200) return this.$message('登录失效')
            this.userList = data.arr
            console.log(this.userList);
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
                this.getUserList()
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
                this.getUserList()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        }
    },
}
</script>
<style lang="less" scoped>
.changeInput{
    display: block!important;
    width: 80%!important;
}
.firstbtn{
    margin-bottom: 20px;
}
</style>