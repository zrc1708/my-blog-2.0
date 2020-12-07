<template>
    <div id="app" ref="app">
        <div class="row1">
            <div class="imgbox">
                <img src="../assets/jibei.jpg" alt="">
            </div>
            <div class="introduce">
                <span>热情的学习者</span>
                <span>普通的开发者</span>
                <span>贫穷的数码迷</span>
            </div>
        </div>
        <div class="row2">
            <span>极北</span>
            <span>Coder & Developer</span>
            <span><i></i>江苏·南京</span>
            <a href="https://github.com/zrc1708" target="_blank">GitHub</a>
        </div>
        <div class="row3">
            <div><span>{{$store.state.articleNum}}</span><span>文章</span></div>
            <div><span>{{$store.state.labelNum}}</span><span>标签</span></div>
        </div>
    </div>
</template>
<script>
let item = document.querySelector('#app')


export default {
    
}
</script>
<style lang="less" scoped>
    #app{
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 10px;
        box-shadow:0px 2px 15px 4px #eeeeee;
        display: grid;
        grid-template-rows: 100px 170px 1fr;
        padding-top: 20px;
        color: #565a5f;
        .row1{
            display: flex;
            height: 100px;
            .imgbox{
                flex: 1;
                height: 100px;
                text-align: center;
                img{
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 5px;
                    box-shadow:0px 2px 6px 4px #f5f5f5;
                }
            }
            .introduce{
                height: 100px;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: center;
                box-sizing: border-box;
                span{
                    text-align: center;
                    display: block;
                    color: #808080ad;
                    font-size: 13px;
                    margin: 5px 0;
                }
            }
        }
        .row2{
            span{
                display: block;
                text-align: center;
                margin: 3px;
            }
            span:nth-child(1){
                padding-top: 15px;
                font-size: 30px;
                font-weight: bold;
            }
            span:nth-child(3){
                i{
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background: url(../assets/icons.png) no-repeat;
                    background-size: cover;
                    background-position: 1px 0;
                    margin-right: 5px;
                    transform: translateY(4px);
                }
                color: #9a9ea3;
                padding-bottom: 20px;
            }
            a{
                display: block;
                width: 50%;
                height: 40px;
                margin: 0 auto;
                background-color: #38b7ea;
                text-align: center;
                line-height: 40px;
                font-size: 20px;
                text-decoration: none;
                color:inherit;
                color: white;
                border-radius: 10px;
                transition: all .4s;
                &:hover{
                    background-color: #78c6e6;
                }
            }
        }
        .row3{
            display: flex;
            margin-top: 20px;
            div{
                flex: 1;
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: center;
                border-top: 1px solid #eeeeee;
                padding-bottom: 10px;
                span:nth-child(1){
                    font-size: 30px;
                    display: block;
                    text-align: center;
                }
                span:nth-child(2){
                    font-size: 17px;
                    display: block;
                    text-align: center;
                }
            }
            div:nth-child(2){
                border-left: 1px solid #eeeeee;
            }
        }
    }
    @media(max-width:945px){
        #app{
            padding-top: 10px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-content: center;
            .row1{
                flex: 1;
                justify-content: center;
                align-content: center;
                .imgbox{
                    img{
                        width: 90px;
                        height: 90px;
                    }
                }
            }
            .row2{
                flex: 1;
                span:nth-child(1){
                    padding-top: 0;
                }
                span:nth-child(3){
                    padding-bottom: 0;
                }
                a{
                    display: none;
                }
            }
            .row3{
                flex: 1;
                margin-top: 8px;
                div{
                    border-top: 0;
                }
                div:nth-child(2){
                    border-left: 0;
                }
            }

        }
    }
    @media(max-width:720px){
        #app{
            .row1{
                display: none;
                margin-top: -5px;
            }
            .row2{
                margin-top: -5px;
                span:nth-child(1){
                    padding-top: 0;
                }
                span:nth-child(2){
                    display: none;
                }
            }
            .row3{
                margin-top: 6px;
            }
        }
    }
    @media(max-width:433px){
        #app{
            padding-top: 0;
            .row2{
                line-height: 60px;
                display: flex;
                span{
                    width: 50%;
                    margin: 0;
                }
                span:nth-child(1){
                    font-size: 25px;
                    font-weight: normal;
                }
                span:nth-child(3){
                    font-size: 14px;
                    transform: translateY(4px);
                }
            }
            .row3{
                line-height: 60px;
                margin-top: 0;
                div{
                    flex-direction: row;
                    padding-bottom: 0;
                    span:nth-child(1){
                        font-size: 14px;
                    }
                    span:nth-child(2){
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>