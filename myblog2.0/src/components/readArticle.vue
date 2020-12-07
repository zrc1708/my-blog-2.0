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
    created() {
        let data=window.location.href;
        let id=data.split("?articleid=")[1];
        this.getmd(decodeURIComponent(id))
    },
    methods: {
        async getmd(id){
            let converter = new showdown.Converter();
            let {data} = await this.$http.get(`/readarticle/${id}`)
            this.html = converter.makeHtml(data.arr[0].content);
        }
    },
}
</script>

<style lang="less" scoped>
@import "../assets/css/md.css";
    #app{
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        background-color: white;
        border-radius: 10px;
        box-sizing: border-box;
        box-shadow:0px 2px 6px 4px #f5f5f5;
        padding: 20px;
    }
</style>