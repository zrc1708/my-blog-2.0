<template>
    <div id="app">
        <el-container>
            <el-header>
                <img src="../assets/nico.png" alt="">
                <span>jibei·极北</span><span>blog后台</span>
            </el-header>
            <el-container>
                <!-- 侧边导航 -->
                <el-aside width="200px">
                    <el-menu :default-active="$route.path.slice(1)" :router='true'  background-color="white">
                    <el-menu-item index="myarticle">
                        <i class="el-icon-s-order"></i>
                        <span slot="title">我的文章</span>
                    </el-menu-item>
                    <el-menu-item index="publish">
                        <i class="el-icon-edit"></i>
                        <span slot="title">发表文章</span>
                    </el-menu-item>
                    <el-menu-item index="mysort">
                        <i class="el-icon-menu"></i>
                        <span slot="title">我的分类</span>
                    </el-menu-item>
                    <el-menu-item index="mylabel">
                        <i class="el-icon-tickets"></i>
                        <span slot="title">我的标签</span>
                    </el-menu-item>
                    <el-menu-item index="me">
                        <i class="el-icon-user"></i>
                        <span slot="title">自我介绍</span>
                    </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!-- 路由占位符 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
    #app{
        height: 100%;
    }
    .el-header{
        background-color: white;
        border-bottom: 1px solid #eeeeee;
        img{
            height: 100%;
            vertical-align:bottom;
            margin-right: 20px;
        }
        span{
            font-size: 20px;
            font-weight: bold;
            line-height: 60px;
        }
        span:nth-child(3){
            margin-left: 1em;
        }
    }
    .el-container{
        height: 100%;
        .el-menu{
            border-right: 0!important;
        }
        // .el-menu-item{
        //     background-color: white!important;
        // }
        // .el-menu-item:hover{
        //     background-color: #ffffff!important;
        // }
    }
    .el-aside{
        background-color: white;
        border-right: 1px solid #eeeeee;
    }
</style>