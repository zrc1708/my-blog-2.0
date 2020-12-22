<template>
    <div class="weather-box">
        最近天气
        <div class="box" v-if="weather">
            <div class="row-city">{{weather.city}}</div>
            <div class="row-today">
                <span class="num">{{weather.data[0].tem}}</span>
                <span class="weather">{{weather.data[0].wea}}</span>
            </div>
            <div class="row2">
                {{weather.data[1].day}}
                {{weather.data[1].tem}}
                {{weather.data[1].wea}}
            </div>
            <div>
                {{weather.data[2].day}}
                {{weather.data[2].tem}}
                {{weather.data[2].wea}}
            </div>
        </div>
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

    &:hover .box{
        visibility: visible;
        opacity: 1;
    }
}
.box{
    background: linear-gradient(#026ebb,#52b3f7);
    position: absolute;
    bottom: 100%;
    right: 0;
    min-width: 200px;
    color: white;
    padding: 10px;
    border-radius: 4px;
    overflow: hidden;

    // display: none;
    visibility: hidden;
    opacity: 0;

    transition: all .5s;

    .row-city{
        font-size: 18px;
        text-align: right;
    }
    .row-today{
        margin-top: -15px;
        position: relative;
        .num{
            font-size: 35px;
            margin-right: 10px;
        }
        .weather{
            font-size: 24px;
        }

        &::after{
            content: '';
            position: absolute;
            top: 100%;
            left: 0;
            margin-left: 10px;
            display: block;
            width: 100%;
            height: 2px;
            background-color: white;
        }
    }
    .row2{
        margin-top: 5px;
    }
}
</style>