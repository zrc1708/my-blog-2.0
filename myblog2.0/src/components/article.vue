<template>
    <div id="app">
       <div class="article" @click="readArticle">{{article.title}}</div>
       <ul>
            <li><i></i>{{article.date.split('T')[0]}}</li>
            <li @click="read('sort',article.sortname)"><i></i>{{article.sortname}}</li>
            <li @click="read('label',article.labelname)"><i></i>{{article.labelname}}</li>
            <!--清除浮动样式-->
            <div style="clear:both;"></div>
       </ul>
       <div class="detail">
            {{article.detail}}
       </div>
    </div>
</template>
<script>
export default {
    props: ['article'],
    methods: {
        readArticle(){
            let id = this.article.id+'?'+Math.random()
            this.$store.commit('setArticleId',id)
        },
        read(category,name){
            let data=window.location.href;
            let oldname = decodeURIComponent(data.split("?")[1]);
            if(oldname===`category=${category}&name=${name}`) return
            this.$router.push({
                path:`/clarticle?category=${category}&name=${name}`,
            })
        }
    },
}
</script>
<style lang="less" scoped>
    #app{
        width: 100%;
        background-color: white;
        border-radius: 10px;
        box-shadow:0px 2px 6px 4px #f5f5f5;
        margin-bottom: 20px;
        padding: 15px;
        color: #565a5f;
        box-sizing: border-box;
        .article{
            font-size: 30px;
            cursor: pointer;
            &:hover{
                color: #38b7ea;
            }
        }
        ul{
            margin: 0;
            padding: 0;
            li{
                i{
                    margin-right: 10px;
                }
                line-height: 20px;
                margin: 10px;
                float: left;
                list-style: none;
                font-size: 16px;
                &:nth-child(1){
                    margin-left: 0;
                    cursor: default;
                    i{
                        transform: translateY(-2px);
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(../assets/icons.png) no-repeat;
                        background-size: cover;
                        background-position: -16px 0;
                        margin-right: 5px;
                        vertical-align: middle;
                    }
                }
                &:nth-child(2){
                    i{
                        transform: translateY(-2px);
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(../assets/icons.png) no-repeat;
                        background-size: cover;
                        background-position: -32px 0;
                        margin-right: 5px;
                        vertical-align: middle;
                    }
                }
                &:nth-child(3){
                    i{
                        transform: translateY(-2px);
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(../assets/icons.png) no-repeat;
                        background-size: cover;
                        background-position: -48px 0;
                        margin-right: 5px;
                        vertical-align: middle;
                    }
                }
                &:nth-child(2),
                &:nth-child(3){
                    cursor: pointer;
                }
                &:nth-child(2):hover,
                &:nth-child(3):hover{
                    color: #38b7ea;
                }
            }
        }
        .detail{
            font-size: 16px;
        }
    }
    @media(max-width:433px){
    #app{
        margin-bottom: 5px;
        .article{
            font-size: 20px;
        }
        ul{
            li{
                font-size: 13px;
                margin: 0 10px;
            }
        }
    }
  }
</style>