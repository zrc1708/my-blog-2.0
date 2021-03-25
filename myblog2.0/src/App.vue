<template>
<div class="app_container">
  <router-view class="app_router"></router-view>
  <my-foot></my-foot>
</div>

  
</template>

<script>
import foot from './components/foot.vue'

export default {
  components:{
    'my-foot':foot
  },
}
</script>

<style lang="less" scoped>
.app_container{
    display: flex;
    flex-flow: column;
    min-height: 100vh;
}
.app_router{
  flex: 1;
}
  @media(max-width:433px){
    #wife{
      display: none;
    }
  }
</style>
