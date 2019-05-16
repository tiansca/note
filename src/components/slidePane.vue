<template>
  <div class="slidePage">
    <div class="slidePage-head">
      笔记
    </div>
    <div class="slidePage-content">
      <div class="slidePage-group" @click="closeSlide">
        <div class="group-item" @click="changeFilterType('all')">
          <img src="../assets/note.png" alt="">
          <span>全部笔记</span>
          <span>{{usableNote.length}}</span>
        </div>
        <div class="group-item" @click="changeFilterType('collect')">
          <img src="../assets/star.png" alt="">
          <span>我的收藏</span>
          <span>{{collectNote.length}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'slidePane',
    computed:{
        usableNote(){
            return this.$store.getters.usableNote;
        },
        collectNote(){
            return this.$store.getters.collectNote;
        }
    },
    data () {
      return {
        msg: 'slidePane'
      }
    },
    methods:{
      closeSlide(){
        this.$store.commit('setSlide');
        this.$store.commit('setGlobalBg',1);
      },
      changeFilterType(n){
        this.$store.commit('setFilterType',n)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .slidePage{
    width: 70%;
    height: 100%;
    position: fixed;
    top:0;
    left: 0;
    background-color: #fff;
    z-index: 2;
    padding:0;
  }
  .slidePage-head{
    font-size: 20px;
    font-weight: 600;
    background-color: #fbfbfb;
    padding:0 14px;
    line-height: 50px;
    height: 50px;
  }
  .slidePage-content{
    height: calc(100% - 50px);
    position: absolute;
    top:50px;
    background-color: #f8f8f8;
    width: 100%;
    overflow: auto;
  }
  .slidePage-group{
    background-color: #fff;
    padding:0 18px;
  }
  .group-item{
    font-size: 0;
    padding:8px 0;
    border-bottom: 0.5px solid #cacaca;
  }
  .group-item>img{
    width: 22px;
    vertical-align: middle;
    margin-top: -1px;
  }
  .group-item>span{
    vertical-align: middle;
    font-size: 16px;
    margin-left: 5px;
  }
  .group-item>span:last-of-type{
    float: right;
  }
  .group-item:last-of-type{
    border-bottom: none;
  }

</style>
