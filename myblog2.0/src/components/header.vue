<template>
    <div id="app">
        <div class="header">
            <a href="http://www.jibei66.com">
                <img src="../assets/nico.png" alt="">
                <span><span class="hide">jibei·</span>极北</span>
            </a>
            <ul>
                <li @click="move('/blog/articlelist')">主页</li>
                <li @click="move('/blog/allarticle')">归档</li>
                <li @click="move('/blog/filebox')">文件箱</li>
                <li @click="move('/blog/userspace')">个人空间</li>
                <li @click="move('/blog/me')">关于站长</li>
                <!--清除浮动样式-->
                <div style="clear:both;"></div>
            </ul>
            <div class="serchbox">
                <input type="text" class="search" v-model="searchdata" @keydown.enter="search" placeholder="搜索">
                <img src="../assets/搜索.png" alt="" class="searchicon" @click="search">
            </div>
            <span class="username" v-if="$store.state.userName">你好，{{$store.state.userName}}</span>
            <button class="my-button login" @click="login" v-if="!$store.state.userName">登录</button>
            <button class="my-button login" @click="logout" v-else>登出</button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            searchdata:''
        }
    },
    methods: {
        move(url){
            let data=window.location.href;
            let name=data.split("/#")[1];
            if(name===url)  {
                // 刷新文章列表
                this.$store.commit('setArticleList')
                return
            }

            this.$router.push({
                path:url,
            },
            onComplete => {},
            onAbort => {})
        },
        search(){
            if(this.$route.query.searchtitle==this.searchdata){
                this.searchdata = ''
                return
            }
            this.$router.push(`/blog/search?searchtitle=${this.searchdata}`)
            this.searchdata = ''
        },
        login(){
            this.$router.push('/login')
        },
        logout(){
            this.$store.commit('setUserName','')
            this.$store.commit('setUserId','')
            this.$cookie.remove('rememberme')
            sessionStorage.clear()
            this.$router.push('/')
        }
    },
}
</script>
<style lang="less" scoped>
    @keyframes show{
		0%{
            width: 0%;
        }
        100%{
            width: 100%;
        }
	}
    #app{
        width: 100%;
        display: flex;
        justify-content: center;
        align-content: center;
        box-shadow:0px 2px 15px 4px #eeeeee;
        background-color: white;
        padding: 0 20px;
        .header{
            width: 100%;
            max-width: 1770px;
            display: flex;
            position: relative;
            a{
                display: block;
                text-decoration: none;
                color:inherit;
                margin-right: 20px;
                img{
                    vertical-align: bottom;
                    width: 60px;
                    height: 60px;
                    margin-right: 20px;
                }
                span{
                    font-size: 25px;
                    line-height: 60px;
                }
            }
            ul {
                margin: 0;
                padding: 0;
                li{
                    float: left;
                    list-style: none;
                    margin: 20px;
                    position: relative;
                    cursor: pointer;
                    font-size: 16px;
                    &:hover::after{
                        animation:show 0.2s ease-in-out forwards;
                    }
                    &::after{
                        content: "";
                        display: block;
                        position: absolute;
                        // top: 37px;
                        bottom: -7px;
                        // width: 100%;
                        height: 3px;
                        background-color: #38b7ea;
                    }
                }
            }
            .serchbox{
                position: relative;
                margin-left: auto;
                margin-right: 20px;
            }
            .search{
                box-sizing: border-box;
	            outline: none;
                height: 35px;
                border-radius: 20px;
                border: 1px solid #a9b4c2;
                padding-left: 10px;
                background-color: white;
                width: 300px;
                margin-top: 13px;
                font-size: 16px;
            }
            .searchicon{
                width: 30px;
                height: 30px;
                position: absolute;
                z-index: 2;
                right: 7px;
                top: 16px;
                cursor: pointer;
            }
            .login{
                height: 40px;
                margin: auto 0;
            }
            .username{
                line-height: 60px;
                margin-right: 20px;
                font-size: 16px;
            }
        }
    }
    @media(max-width:945px){
        #app{
            .header{
                .search{
                    margin-right: 7%;
                }
                .searchicon{
                    right: 8%;
                }
            }
        }
    }
    @media(max-width:789px){
        #app{
            .header{
                .search{
                    width: 200px;
                }
            }
        }
    }
    @media(max-width:682px){
        #app{
            .header{
                .search{
                    display: none;
                }
                .searchicon{
                    display: none;
                }
            }
        }
    }
    @media(max-width:496px){
        #app{
            .header{
                ul{
                    li{
                        margin: 20px 8px;
                    }
                }
            }
        }
    }
    @media(max-width:433px){
        #app{
            .header{
                .hide{
                    display: none;
                }
            }
        }
    }
</style>