<template>
    <div class="box">
        <div class="row1">
            <span class="username">{{comment.username}}</span>
            <span class="recommend">{{comment.recommend | toRecommend}}</span>
        </div>
        <div  class="row2">
            <p v-html="content"></p>
        </div>
    </div>
</template>

<script>
 
export default {
    props:['comment'],
    data(){
        return {

        }
    },
    filters: {
        toRecommend(value) {
            if (!value) return ''
            if(value==1){
                return '推荐'
            }else{
                return '不推荐'
            }
        }
    },
    computed:{
        content(){
            return this.comment.content.replace('\n','<br/>')
        }
    },
    methods:{
        
    }
}
</script>

<style lang="less" scoped>
.row1{
    font-size: 16px;
    .recommend{
        margin-left: 20px;
    }
}
.row2{
    p{
        font-size: 16px;
        margin-top: 5px;
        color: #606266;
    }
}
.box{
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 5px;
    padding: 20px;
}
</style>