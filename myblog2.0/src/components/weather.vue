<template>
    <div class="weather-box">
        最近天气
    </div>
</template>

<script>
 
export default {
    props:['weather'],
    data(){
        return {

        }
    },
    filters: {
        
    },
    computed:{
        
    },
    methods:{
        
    }
}
</script>

<style lang="less" scoped>
.weather-box{
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 15px;
    background-color: white;
    border: 1px solid #eeeeee;
    box-sizing: border-box;
    cursor: pointer;
}
</style>