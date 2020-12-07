<template>
    <div id="app">
        <div class="box">
            <img src="../assets/jibei.jpg" alt="">
            <el-input v-model="loginform.username" placeholder="用户名" class="login"></el-input>
            <el-input v-model="loginform.password" placeholder="密码" class="login" type="password"></el-input>
            <div class="button">
                <el-button @click="login">登录</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loginform:{
                username:'',
                password:''
            }
        }
    },
    // created:function(){
    //     // 添加键盘回车事件
    //     let that = this;
    //     document.onkeydown = function (e) {
    //         let key = window.event.keyCode;
    //         if (key === 13){
    //         that.login()
    //     }
    //   }
    // },
    methods: {
        // 登录
      async login(){
        const {data} = await this.$http.post('checkuser',this.loginform)
        // console.log(data);
        window.sessionStorage.setItem('token',data.token)
        window.sessionStorage.setItem('name',data.rs[0].username)
        if(data.code===201) 
          return this.$message.error('登录失败')
        else{
            this.$message.success('登录成功')
            this.$router.push({
                path:`/home`,
                // query:{articleId:id}
            })
        }
      },
    },
}
</script>
<style lang="less" scoped>
    #app{
        position: relative;
        width: 100%;
        height: 100%;
        .box{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-80%);
            width: 20vw;
            height: 300px;
            background-color: white;
            box-shadow:0px 2px 6px 4px #f5f5f5;
            padding: 30px;
            box-sizing: border-box;
            padding-top: 3vw;
            min-width: 300px;
            img{
                position: absolute;
                left: 50%;
                top: -20%;
                transform: translate(-50%,0);
                z-index: 2;
                width: 5vw;
                height: 5vw;
                border-radius: 50%;
                box-sizing: border-box;
                border: 1px solid #eeeeee;
                box-shadow:0px 2px 6px 4px #f5f5f5;
            }
            .button{
                display: flex;
                justify-content: flex-end;
            }
        }
    }
    .login{
        margin-bottom: 20px!important;
    }
</style>