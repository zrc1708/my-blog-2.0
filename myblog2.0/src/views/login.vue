<template>
    <div class="back">
        <div class="loginbox">
            <div class="backtobolog" @click="goBackBlog">回到博客</div>
            <div class="left"></div>
            <div class="right">
                <div class="row title">
                    <span>{{isregistor?'注册':'登录'}}</span>
                </div>
                <div class="row input-row">
                    <input type="text" class="my-input input-login" placeholder="用户名" @input="checkuser" v-model="username">
                </div>
                <div class="row row2 input-row">
                    <input type="password" class="my-input input-login" placeholder="密码" v-model="password">
                </div>
                <div class="row row2 input-row">
                    <input type="password" class="my-input input-login" placeholder="确认密码" v-model="password2" @blur="recognize" v-if="isregistor">
                </div>
                <span class="register checkboxrow" v-if="!isregistor">
                    <label for="checkbox" class="checkbox"><input type="checkbox" id="checkbox" v-model="rememberme">
                    <span>记住我</span></label>
                </span>
                <span class="register" v-if="!isregistor">如果你没有账号，点击
                    <span class="toregister" @click="toRegister">注册</span></span>
                <span class="register register2">{{iswrong2?'此用户名已存在':''}}</span>
                <span class="register register2">{{iswrong?'密码不一致':''}}</span>
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
            isregistor:false,
            iswrong:false,
            iswrong2:false,
            rememberme:false
        }
    },
    methods: {
        async login(){
            let data = {
                username:this.username,
                password:this.password
            }
            let res = await this.$http.post('/blogcheckuser',data)
            if(res.data.code==200){
                if(this.rememberme){
                    this.$cookie.set('rememberme',true,{expires: 7})
                }
                let user = res.data.rs[0]

                this.$store.commit('setUserName',user.username)
                this.$store.commit('setUserId',user.id)
                this.$store.commit('setUserBirthtime',user.birthtime)

                this.username = ''
                this.password = ''
                this.$router.push(`/`)

            }else{
                alert('登录失败')
            }
        },
        goBackBlog(){
            this.$router.push('/')
        },
        toRegister(){
            this.username = ''
            this.password = ''
            this.isregistor = true
        },
        back(){
            this.isregistor = false
            this.iswrong = false
            this.iswrong2 = false
            this.username = ''
            this.password = ''
            this.password2 = ''
        },
        recognize(){
            if(this.password2!==this.password){
                this.iswrong = true
            }else{
                this.iswrong = false
            }
        },
        async checkuser(){
            if(!this.isregistor){return}
            let data = {username:this.username}
            let res = await this.$http.post('/getusername',data)
            if(res.data.rs==1){
                this.iswrong2 = true
            }else{
                this.iswrong2 = false
            }
        },
        async register(){
            if(this.iswrong || this.iswrong2){
                return
            }
            let data = {
                username:this.username,
                password:this.password
            }
            let res = await this.$http.post('/adduser',data)
            if(res.data.code==200){
                alert('注册成功')
                this.username = ''
                this.password = ''
                this.password2 = ''
            }else{
                alert('注册失败')
            }
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

    .backtobolog{
        position: absolute;
        top: 5%;
        right: 0;
        font-size: 25px;
        color: white;
        padding: 10px 10px 10px 50px;
        background: linear-gradient(60deg,transparent 20%, #409eff 0);
        cursor: pointer;
        &:hover{
            background: linear-gradient(60deg,transparent 20%, #1e8dfc 0);
        }
    }
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
    .register2{
        color: red;
        font-size: 12px;
        min-height: 15px;
    }
    .toregister{
        color:  #409eff;
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
    .checkboxrow{
        text-align: right;
        -moz-user-select:none; /*火狐*/
        -webkit-user-select:none; /*webkit浏览器*/
        -ms-user-select:none; /*IE10*/
        -khtml-user-select:none; /*早期浏览器*/
        user-select:none;
        input{
            vertical-align: middle;
        }
        span{
            vertical-align: middle;
            transform: translateY(-1px);
            margin-left: 10px;
        }
    }
}
</style>