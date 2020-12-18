<template>
    <div id="app">
        <div class="row1">
            <input type="text" class="my-input codeinput">
            <button class="my-button btn">提取文件</button>
        </div>
        <div class="controlrow">
            <button class="my-button btn2" @click="mkdir">创建文件夹</button>
            <button class="my-button btn2" @click="choosefile">选择文件</button>
            <span>{{this.choosedFileName}}</span>
            <button class="my-button btn2" @click="uploadFile" v-show="choosedFileName">上传文件</button>
            <input id="flieinput" type="file" ref="file" @change="checkField($event)">
        </div>
        <div class="pathrow">
            <span class="pathname" @click="basepath">根目录</span>
            <span v-for="(item,index) in pathArr" :key="item">
                <span class="pathicon">></span>
                <span class="pathname" @click="pathClick(item,index)">{{item.name}}</span>
            </span>
        </div>
        <div class="row2">
            <my-fileline v-for="file in filesList" :key="file" :file="file" 
            @cd='cd'
            @rename='rename'
            @remove='remove'></my-fileline>
        </div>
    </div>
</template>

<script>
import fileline from '../components/fileline.vue'

export default {
    data(){
        return {
            choosedFileName:'',
            filesListArr:[],
            filesList:'',
            pathArr:[]
        }
    },
    mounted(){
        this.getAllFiles()
    },
    methods:{
        async getAllFiles(path=this.$store.state.userName){
            if(path){
                let {data} =await this.$http.post('/getfile',{path})
                if(data.code==200){
                    this.filesListArr = [data.arr]
                    this.filesList = data.arr
                    this.pathArr = []
                }
            }else{
                setTimeout(() => {
                    this.getAllFiles()
                }, 50);
            }
        },
        // 根据当前路径获取文件
        async getFilesByPath(){
            let path = [this.$store.state.userName]
            this.pathArr.forEach(item =>{
                path.push(item.name)
            })
            let {data} =await this.$http.post('/getfile',{path})
            if(data.code==200){
                this.filesList = data.arr
            }
        },
        // 监听文件上传input的改变
        checkField(dom){
            let arr = dom.target.value.split('\\')
            this.choosedFileName = arr[arr.length-1]
        },
        // 选择上传的文件
        choosefile() {
            let nico = document.querySelector('#flieinput')
            nico.click()
        },
        // 上传文件
        async uploadFile(){
            let username = this.$store.state.userName
            let userid = this.$store.state.userId

            let path = [this.$store.state.userName]
            this.pathArr.forEach(item => {
                path.push(item.name)
            });

            let formData = new FormData();
            formData.append('savePath', path);
            formData.append('userid', userid);
            formData.append('file', this.$refs.file.files[0])

            let {data} =await this.$http.post(`/uploadfile`, formData, {
                'Content-Type': 'multipart/form-data'
            })
            if(data.code==200){
                this.choosedFileName = ''
                this.getFilesByPath()
                alert('上传成功')
            }else if(data.code==400){
                alert('上传失败，文件名存在非法的特殊字符')
                this.choosedFileName = ''
            }
        },
        // 进入文件夹
        cd(file){
            this.pathArr.push(file)
            this.getFilesByPath()
        },
        // 文件路径点击
        pathClick(file,index){
            this.pathArr.splice(index+1)
            this.getFilesByPath()
        },
        // 返回根目录
        basepath(){
            this.getAllFiles()
        },
        // 创建文件夹
        async mkdir(){
            let dirname = prompt('请输入文件夹名')
            if(dirname==''||dirname==null){
                return
            }

            let path = [this.$store.state.userName]
            this.pathArr.forEach(item => {
                path.push(item.name)
            });
            path.push(dirname)

            let {data} = await this.$http.post('/mkdir',{path})
            if(data.code==200){
                this.getFilesByPath()
                alert('创建成功')
            }else if(data.code==400){
                alert('创建失败，文件夹重名')
            }
        },
        // 重命名
        async rename(file){
            let newname = prompt('请输入新文件名')
            if(newname==''||newname==null){
                return 
            }
            
            let oldPathArr = file.path.split('\\')
            oldPathArr[oldPathArr.length-1]=newname+'.'+file.type

            const data = {
                oldname:file.path,
                newname:oldPathArr,
                name:file.name,
                userid:this.$store.state.userId
            }

            let {data:res} = await this.$http.post('/rename',data)
            if(res.code==200){
                this.getFilesByPath()
                alert('重命名成功')
            }else{
                alert('重命名失败，重名了')
            }
        },
        // 删除
        async remove(file){
            if(!confirm('确定要删除吗')){
                return
            }
            let data = {
                path: file.path,
                type: file.type
            }
            let {data:res} = await this.$http.post('/remove',data)
            if(res.code==200){
                this.getFilesByPath()
                alert('删除成功')
            }else{
                alert('删除失败')
            }
        }
    },
    components:{
        'my-fileline':fileline
    }
}
</script>

<style lang="less" scoped>
#app{
    width: 100%;
    background-color: white;
    border-radius: 10px;
    box-sizing: border-box;
    box-shadow:0px 2px 6px 4px #f5f5f5;
    padding: 20px;
    padding-left: 40px;
}
#flieinput{
     visibility: hidden;
}
.btn{
    margin-left: 20px;
}
.btn2{
    margin-right: 20px;
}
.row1{
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 15px;

    .codeinput{
        padding: 0px 12px 0 12px;
        width: 200px;
        font-size: 15px;
    }
}
.controlrow{
    padding-top: 20px;
    padding-bottom: 10px;
    span{
        margin-right: 20px;
    }
}
.row2{
    border-top: 1px solid #eeeeee;
}
.pathrow{
    font-size: 15px;

    .pathicon{
        font-size: 17px;
        color: #9e9e9e;
    }
    .pathname{
        display: inline-block;
        padding: 5px;
        cursor: pointer;
        color: #38b7ea;

        &:hover{
            text-decoration: underline;
        }
    }
}
</style>