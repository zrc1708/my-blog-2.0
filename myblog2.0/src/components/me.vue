<template>
    <div id="app">
        <div class="markdown-body" v-html="html" v-highlight></div>
    </div>
</template>
<script>
import showdown from 'showdown'


export default {
    data() {
        return {
            html:'',
        }
    },
    created () {
      this.getmd()  
    },
    methods: {
        async getmd(){
            let converter = new showdown.Converter();
            let {data} = await this.$http.get(`/getme`)
            this.html = converter.makeHtml(data.arr[0].content);
        }
    },
}
</script>

<style lang="less" scoped>
@import "../assets/css/md.css";
    #app{
        width: 100%;
        background-color: white;
        border-radius: 10px;
        box-sizing: border-box;
        box-shadow:0px 2px 6px 4px #f5f5f5;
        padding: 20px;
        padding-left: 40px;
        
    }
</style>