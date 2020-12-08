<template>
    <div class="back">
        <div class="loginbox">
            <div class="left"></div>
            <div class="right">
                <div class="row title">
                    <span>{{isregistor?'注册':'登录'}}</span>
                </div>
                <div class="row input-row">
                    <input type="text" class="my-input input-login" placeholder="用户名" v-model="username">
                </div>
                <div class="row row2 input-row">
                    <input type="password" class="my-input input-login" placeholder="密码" v-model="password">
                </div>
                <div class="row row2 input-row">
                    <input type="password" class="my-input input-login" placeholder="确认密码" v-model="password2" v-if="isregistor">
                </div>
                <span class="register" v-if="!isregistor">如果你没有账号，点击
                    <span class="toregister" @click="toRegister">注册</span></span>
                <div class="row button-row">
                    <button class="my-button btn" @click="back" v-if="isregistor">返回</button>
                    <button class="my-button btn" @click="register" v-if="isregistor">注册</button>
                    <button class="my-button btn" @click="login" v-if="!isregistor">登录</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            username:'',
            password:'',
            password2:'',
            isregistor:false
        }
    },
    methods: {
        login(){
            console.log(this.username,this.password);
        },
        toRegister(){
            this.username = ''
            this.password = ''
            this.isregistor = true
        },
        back(){
            this.isregistor = false
            this.username = ''
            this.password = ''
            this.password2 = ''
        },
        register(){

        }
    },
}
</script>

<style lang="less" scoped>
.back{
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -2;
        background-image: url('../assets/macOS-Big-Sur-Daylight-Wallpaper-iDownloadBlog.jpg');
        background-position: center center;
        background-size: cover;
        background-attachment: fixed;
        
    }
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background-image: url('../assets/macOS-Big-Sur-Daylight-Wallpaper-iDownloadBlog.jpg');
        background-position: center center;
        background-size: cover;
        background-attachment: fixed;
        -webkit-filter: blur(2px);
        -moz-filter: blur(2px);
        -ms-filter: blur(2px);
        -o-filter: blur(2px);
        filter: blur(4px);
    }
}
.loginbox{
    display: flex;
    height: 800px;
    width: 1000px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -500px;
    margin-top: -400px;

    .left {
        flex: 1;
        background-image: url('../assets/macOS-Big-Sur-Daylight-Wallpaper-iDownloadBlog.jpg');
        background-position: center center;
        background-size: cover;
        background-attachment: fixed;
        border-top: 5px solid white;
        border-bottom: 5px solid white;

    }
    .right{
        flex: 1;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}
.right{
    .row{
        line-height: 70px;
    }
    .row2{
        margin-top: -10px;
    }
    .title{
        font-size: 30px;
        padding-left: 10%;
        color: #409eff;
        position: relative;
        span{
            &::after{
                content: '';
                display: block;
                width: 70px;
                height: 4px;
                position: absolute;
                background: linear-gradient(-45deg,transparent 20%, #409eff 0);
                left: 10%;
                top: 80%;
            }
        }
    }
    .input-row{
        text-align: center;
    }
    .input-login{
        font-size: 16px;
        padding: 3px 15px 0 15px;
        width: 60%;
    }
    .button-row{
        text-align: right;
        padding-right: 50px;
        .btn{
            margin-left: 20px;
        }
    }
    .register{
        font-size: 15px;
        width: 60%;
        margin: 0 auto;
    }
    .toregister{
        color:  #409eff;
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
}
</style>