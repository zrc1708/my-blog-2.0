<template>
  <div id="app">
    <my-header></my-header>

    <div class="content">

      <div class="leftbar">
        <my-card ></my-card>
        <div class="showbar">
          <my-blackboard></my-blackboard>
          <my-mycloud @clickcloud="gotoclass" :datalist="labelList"></my-mycloud>
        </div>
      </div>

      <div class="content_article">
        <router-view></router-view>
      </div>

      <div class="sidebar">
        <my-blackboard></my-blackboard>
        <my-mycloud @clickcloud="gotoclass" :datalist="labelList"></my-mycloud>
      </div>
    </div>
    <!-- github快捷按钮 -->
    <my-github></my-github>
    <!-- 底部备案信息 -->
    <my-foot></my-foot>
  </div>
</template>
<script>
import header from '../components/header.vue'
import mycard from '../components/mycard.vue'
import myarticle from '../components/article.vue'
import blackboard from '../components/blackboard.vue'
import mycloud from '../components/cloud.vue'
import github from '../components/github.vue'
import foot from '../components/foot.vue'

export default {
  components:{
    'my-header':header,
    'my-card':mycard,
    'my-article':myarticle,
    'my-blackboard':blackboard,
    'my-mycloud':mycloud,
    'my-github':github,
    'my-foot':foot
  },
  data() {
    return {
        labelList:[]
    }
  },
  created() {
        this.getLabels(),
        this.getArticlesCount(),
        this.getImage()
        this.login()
  },
  methods: {
    async login(){
      // 没有设置自动登录
      if(!this.$cookie.get('rememberme')) return
      // 用户已手动登录
      if(this.$store.state.userName) return

      let {data:res} =await this.$http.post('/automaticlogin')
      if(res.code==200){
        this.$store.commit('setUserName',res.rs[0].username)
        this.$store.commit('setUserId',res.rs[0].id)
        this.$cookie.set('rememberme',true,{expires: 7})
      }
      
    },
    // cloud子组件点击事件，返回值为被点击的元素名称
    gotoclass(name){
      let data=window.location.href;
      let oldname = decodeURIComponent(data.split("&name=")[1]);
      if(oldname===name) return
      this.$router.push({
          path:`/blog/clarticle?category=label&name=${name}`,
      })
    },
    // 获取标签列表，传递给cloud子组件
    async getLabels(){
      const {data} = await this.$http.get(`getLabelCloud`)
      if (data.code !== 200) return this.$message('登录后方可使用此功能')
      // console.log(data);
      this.labelList = data.arr
      this.$store.commit('setlabelNum',this.labelList.length)
    },
    // 获取文章数量
    async getArticlesCount(){
      const {data} = await this.$http.get(`getArticlesCount`)
      if (data.code !== 200) return this.$message('登录后方可使用此功能')
      let count = data.arr[0]['count(*)']
      this.$store.commit('setArticleNum',count)
    },
    // 预加载图片
    getImage(){
        let image = new Image()
        image.src = '../assets/macOS-Big-Sur-Daylight-Wallpaper-iDownloadBlog.jpg'
    }
  },
  watch:{
    '$store.state.articleId':function(newFlag, oldFlag){
      let id = this.$store.state.articleId.split('?')[0]
      this.$router.push({
        path:`/blog/readarticle?articleid=${id}`,
      })
    }
  }
}
</script>
<style lang="less">
  #app{
    box-sizing: border-box;
    .content{
      padding-top: 20px;
      display: flex;
      width: 100%;
      max-width: 1770px;
      margin: 0 auto;
        .leftbar{
          padding-left: 20px;
          padding-bottom: 20px;
          height: 420px;
          flex: 2;
          .showbar{
            padding-top: 20px;
            display: none;
          }
        }
        .content_article{
          display: flex;
          flex-direction: column;
          padding: 0 20px;
          flex: 6;
          width: 0;
        }
        .sidebar{
          padding-right: 20px;
          flex: 2;
        }
    } 
  }
  @media(max-width:1200px){
    #app{
      .content{
        .leftbar{
          .showbar{
            display: block;
          }
        }
        .sidebar{
          display: none;
        }
      }
    }
  }
  @media(max-width:945px){
    #app{
      .content{
        flex-direction: column;
        .leftbar{
          height: 125px;
          padding-right: 20px;
          .showbar{
            display: none;
          }
        }
        .sidebar{
          display: none;
        }
        .content_article{
          width: 100%;
        }
      }
    }
  }
  @media(max-width:720px){
    #app{
      .content{
        .leftbar{
          display: none;
        }
      }
    }
  }
  @media(max-width:433px){
    #app{
      .content{
        padding-top: 5px;
        .leftbar{
          display: none;
        }
        .content_article{
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
  }
</style>
