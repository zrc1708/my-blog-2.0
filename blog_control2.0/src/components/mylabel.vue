 <template>
    <div>
        <el-card>
            <el-button class="firstbtn" @click="openadd()">增加标签</el-button>
            <el-table :data="labelList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="labelname" label="分类名" ></el-table-column>
                <el-table-column prop="count" label="相关文章数量" ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="openchange(scope.row)">修改</el-button>
                        <el-button size="mini" :disabled="scope.row.count>0?true:false" @click="deleteLabel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 修改标签对话框 -->
        <el-dialog title="分类修改" :visible.sync="changeDialogVisible" width="30%" class="card">
            <el-form ref="form" :model="form" label-width="25%">
                <el-form-item label="分类名：">
                    <el-input v-model="changed.labelname" class="changeInput"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeLabel">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 增加标签对话框 -->
        <el-dialog title="标签增加" :visible.sync="addDialogVisible" width="30%" class="card">
            <el-form ref="form" :model="form" label-width="25%">
                <el-form-item label="分类名：">
                    <el-input v-model="addname" class="changeInput"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addLabel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            labelList:'',
            changeDialogVisible:false,
            changed:'',
            addDialogVisible:false,
            addname:''
        }
    },
    created() {
        this.getLabelList()
    },
    methods: {
        // 获取分类列表
        async getLabelList(){
            const {data} = await this.$http.get(`getAllLabels`)
            if (data.code !== 200) return this.$message('登录失效')
            // console.log(data.arr);
            let arr = data.arr

            const data2 = await this.$http.get(`getLabelCloud`)
            // console.log(data2.data.arr);
            for(let i= 0;i<arr.length;i++){
                for(let j=0;j<data2.data.arr.length;j++){
                    if(arr[i].labelname===data2.data.arr[j].labelname){
                        arr[i].count = data2.data.arr[j].count
                    }
                }
            }
            this.labelList = arr

        },
        // 打开修改框
        openchange(item){
            this.changeDialogVisible = true
            this.changed = JSON.parse( JSON.stringify(item))
        },
        // 修改标签
        async changeLabel(){
            const {data} = await this.$http.post(`changeLabel`,this.changed)
            if (data.code !== 200) return this.$message('登录失效')
            this.changeDialogVisible = false
            this.getLabelList()
            this.$message.success('标签修改成功')
        },
        // 打开增加框
        openadd(){
            this.addDialogVisible = true
        },
        // 增加标签
        async addLabel(){
            let name = this.addname
            const {data} = await this.$http.post(`addLabel`,{name})
            if (data.code !== 200) return this.$message('登录失效')
            this.addDialogVisible = false
            this.getLabelList()
            this.$message.success('标签增加成功')
        }, 
        //删除标签 
        deleteLabel(item){
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data} =  await this.$http.post(`deleteLabel`,item)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getLabelList()
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