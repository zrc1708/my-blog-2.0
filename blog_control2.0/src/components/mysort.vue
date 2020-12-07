 <template>
    <div>
        <el-card>
            <el-button class="firstbtn" @click="openadd()">增加分类</el-button>
            <el-table :data="sortList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="sortname" label="分类名" ></el-table-column>
                <el-table-column prop="count" label="相关文章数量"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="openchange(scope.row)">修改</el-button>
                        <el-button size="mini" :disabled="scope.row.count>0?true:false" @click="deleteSort(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 修改分类对话框 -->
        <el-dialog title="分类修改" :visible.sync="changeDialogVisible" width="30%" class="card">
            <el-form ref="form" :model="form" label-width="25%">
                <el-form-item label="分类名：">
                    <el-input v-model="changed.sortname" class="changeInput"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeSort">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 增加分类对话框 -->
        <el-dialog title="分类增加" :visible.sync="addDialogVisible" width="30%" class="card">
            <el-form ref="form" :model="form" label-width="25%">
                <el-form-item label="分类名：">
                    <el-input v-model="addname" class="changeInput"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSort">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            sortList:'',
            changeDialogVisible:false,
            changed:'',
            addDialogVisible:false,
            addname:''
        }
    },
    created() {
        this.getSortList()
    },
    methods: {
        // 获取分类列表
        async getSortList(){
            const {data} = await this.$http.get(`getAllSorts`)
            if (data.code !== 200) return this.$message('登录失效')
            let arr = data.arr

            const data2 = await this.$http.get(`getSortCloud`)
            
            // console.log(data2.data.arr);
            for(let i= 0;i<arr.length;i++){
                for(let j=0;j<data2.data.arr.length;j++){
                    if(arr[i].sortname===data2.data.arr[j].sortname){
                        arr[i].count = data2.data.arr[j].count
                    }
                }
            }
            // console.log(arr);
            this.sortList = arr
        },
        // 打开修改框
        openchange(item){
            this.changeDialogVisible = true
            this.changed = JSON.parse( JSON.stringify(item))
        },
        // 修改分类
        async changeSort(){
            const {data} = await this.$http.post(`changeSort`,this.changed)
            if (data.code !== 200) return this.$message('登录失效')
            this.changeDialogVisible = false
            this.getSortList()
            this.$message.success('分类修改成功')
        },
        // 打开增加框
        openadd(){
            this.addDialogVisible = true
        },
        // 增加分类
        async addSort(){
            let name = this.addname
            const {data} = await this.$http.post(`addSort`,{name})
            if (data.code !== 200) return this.$message('登录失效')
            this.addDialogVisible = false
            this.getSortList()
            this.$message.success('分类增加成功')
        },
        //删除分类 
        deleteSort(item){
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data} =  await this.$http.post(`deleteSort`,item)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getSortList()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
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