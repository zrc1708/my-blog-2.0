<template>
    <div id="app">
        <div class="picture"></div>
        <div class="icon"><i @click="move"></i></div>
    </div>
</template>
<script>
    export default {
        methods: {
            move() {
                window.open("https://github.com/zrc1708")
            }
        }
    }
</script>
<style lang="less" scoped>
    #app {
        position: fixed;
        top: 0;
        right: 0;
        display: none;
    }
    .picture {
        width: 0;
        height: 0;
        border: 35px solid;
        border-color: #38b7ea #38b7ea transparent transparent;
    }
    .icon {
        position: fixed;
        top: 0;
        right: 0;
        i {
            transform: rotate(45deg);
            display: inline-block;
            width: 40px;
            height: 40px;
            background: url(../assets/icons.png) no-repeat;
            background-size: cover;
            background-position: -160px 0;
        }
    }
    @media(max-width:945px) {
        #app {
            display: block;
        }
    }
    @media(max-width:433px) {
        .picture {
            border: 22px solid;
            border-color: #38b7ea #38b7ea transparent transparent;
        }

        .icon {
            i {
                transform: rotate(45deg);
                display: inline-block;
                width: 25px;
                height: 25px;
                background: url(../assets/icons.png) no-repeat;
                background-size: cover;
                background-position: -100px 0;
            }
        }
    }
</style>