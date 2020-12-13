<template>
    <div id="app">
        <div class="row1">
            <input type="text" class="my-input codeinput">
            <button class="my-button btn">提取文件</button>
        </div>
        <div class="row2">

        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    mounted(){
        this.getAllFiles()
    },
    methods:{
        async getAllFiles(){
            let username = this.$store.state.userName
            if(username){
                console.log(username);
                let {data} =await this.$http.post('/getfile',{username:username})
                console.log(data);
            }else{
                setTimeout(() => {
                    this.getAllFiles()
                }, 50);
            }
        }
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
.row1{
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 15px;

    .codeinput{
        padding: 0px 12px 0 12px;
        width: 200px;
        font-size: 15px;
    }
    .btn{
        margin-left: 20px;
    }
}
</style>