<template>
    <div id="app">
        <span class="title">标签云</span>
        <span class="cloud" v-for="(item, index) in datalist" 
        :key="index" :style="{fontSize: (item.count-1)*3 + 16 + 'px'}"
        @click="readlist(item.labelname)">{{item.labelname}}</span>
    </div>
</template>
<script>
export default {
    props: ['datalist'],
    data() {
        return {
            labelList:[]
        }
    },
    methods: {
        readlist(name){
            this.$emit('clickcloud',name); 
        },
    },
}
</script>
<style lang="less" scoped>
   #app{
       width: 100%;
       padding: 15px;
       .title{
           display: block;
           font-size: 20px;
           font-weight: bold;
           padding-bottom: 5px;
       }
       .cloud{
           padding: 0 5px;
           word-break: break-all; 
           color: #777;
           &:hover{
               color: #78c6e6;
                cursor: pointer;
           }
       }       
   }
</style>