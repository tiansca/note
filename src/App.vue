<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <router-view class="Router"></router-view>
    </transition>
    <transition name="slide-fade">
      <slide-pane v-show="slidePaneShow"></slide-pane>
    </transition>
    <div v-if="globalBg" class="globalBg" @click="toggleGlobalBg" :style="{ backgroundColor: globalBgColor}"></div>
  </div>
</template>

<script>
  import slidePane from './components/slidePane.vue'
export default {
  name: 'App',
  components:{
      slidePane,
  },
  computed:{
      slidePaneShow(){
          return this.$store.state.slideShow;
      },
      globalBgColor(){
        return this.$store.state.globalBgColor;
      },
      globalBg(){
        return this.$store.state.globalBg;
      }
  },
  data(){
      return{
        transitionName:''
      }
  },
  methods:{
    toggleSlide(){
      this.$store.commit('setSlide');
      this.$store.commit('setGlobalBg',n);
    },
    toggleGlobalBg(n){
      this.$store.commit('setGlobalBg',n);
      if(this.slidePaneShow){
        this.$store.commit('setSlide');
      }
      if(this.$store.state.showMore){
        this.$store.commit('setShowMore');
      }
    }
  },
  watch:{
      globalBgColor(){
//          console.log(this.globalBgColor)
      },
      '$route' (to, from) {
          console.log(to.path)
        if(to.path == '/noteList'){
          this.transitionName = 'slide-right';
        }else{
          this.transitionName = 'slide-left';
        }
//        console.log(this.transitionName)
      }
  },
  mounted(){
      //设置标签
      if(localStorage.getItem('labelArr')){
          this.$store.commit('setLabelArr',JSON.parse(localStorage.getItem('labelArr')))
      }else {
          var labelArr = [{
              value:'0',
              label:'未标签',
              color:'#333'
          }];
//          localStorage.setItem('labelArr', JSON.stringify(labelArr));
          this.$store.commit('setLabelArr',labelArr)
      }

      //设置笔记列表
      if(localStorage.getItem('noteArr')){
        this.$store.commit('setNoteArr',JSON.parse(localStorage.getItem('noteArr')))
      }
  }
}
</script>

<style>
body,html{
  margin:0;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
  .mint-header{
    background-color: #f8f8f8!important;
    color: #1c1c1c!important;
    font-size: 18px!important;
    font-weight: 600!important;
  }
.mint-header-title {
  position: absolute!important;
  left: 40px!important;
  top: 0!important;
}
  .globalBg{
    background-color: rgba(0,0,0,0.2);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
  /*侧滑面板*/
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .5s ease;
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-70%);
  opacity: 0;
}
.moreList{
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 2;
  background-color: #fff;
  padding:8px;
  box-shadow: 0 0 8px 0 rgba(0,0,0,0.2);
  font-size: 14px;
  color: #333;
}
  .moreItem{
    padding-top:5px;
  }
  .moreItem:first-of-type{
    border-bottom: 0.5px solid #999;
    padding-bottom:5px;
    padding-top:0;
  }
/*页面切换动画*/
.Router {
  position: absolute;
  width: 100%;
  transition: all 0.3s ease;
  top: 0;
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(50px, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-50px, 0);
}
  .toast{
    z-index: 9999;
  }
</style>
