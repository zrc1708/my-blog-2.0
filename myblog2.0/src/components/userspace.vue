<template>
    <div id="app">
       <div class="row">
           用户名:<span>{{$store.state.userName}}</span>
       </div>
       <div class="row">
           在<span>{{birthtime}}</span>，您注册了本站
       </div>
       <div class="row">
           您一共发表了<span>{{comment.all}}</span>篇评论，其中好评<span>{{comment.recommend}}</span>篇，差评<span>{{comment.all-comment.recommend}}</span>篇
       </div>
    </div>
</template>
<script>
import moment from '../utils/moment'

export default {
    data () {
        return {
            date:'',
            comment:{
                recommend:0,
                all:0
            }
        }
    },
    mounted(){
        this.getMyInformation()
    },
    computed:{
        birthtime(){
            return moment(this.$store.state.userBirthtime).format("YYYY-MM-DD HH:mm:ss")
        }
    },
    methods: {
        async getMyInformation(){
            if(this.$store.state.userId){
                let {data:res}  = await this.$http.get(`/getmyinformation/${this.$store.state.userId}`)
                if(res.code==200){
                    this.comment.all = res.arr.length
                    res.arr.forEach(item => {
                        if(item.recommend==1){
                            this.comment.recommend++
                        }
                    });
                }
            }else{
                setTimeout(() => {
                    this.getMyInformation()
                }, 20);
            }
        }
    },
}
</script>
<style lang="less" scoped>
#app{
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    background-color: white;
    border-radius: 10px;
    box-sizing: border-box;
    box-shadow:0px 2px 6px 4px #f5f5f5;
    padding: 20px;
    font-size: 16px;
}
.row{
    span{
        color: #38b7ea;
        margin: 0 10px;
    }
}
</style>