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
          <span class="group-item-num">{{usableNote.length}}</span>
        </div>
        <div class="group-item" @click="changeFilterType('collect')">
          <img src="../assets/star.png" alt="">
          <span>我的收藏</span>
          <span class="group-item-num">{{collectNote.length}}</span>
        </div>
      </div>
      <div class="slidePage-group" @click="closeSlide">
        <div class="group-item" v-for="label in usableLabel" @click="changeFilterType(label.value)">
          <span  v-if="label.value == 0" style="display: inline-block;width: 18px;height: 18px">
            <span style="font-size: 18px;position: relative">
            <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #333;font-size: 18px;position: absolute;top: 0;left: 0"></font-awesome-icon>
            <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #fff;font-size: 15.5px;position: absolute;top: 1px; left: 1px"></font-awesome-icon>
          </span>
          </span>
          <span v-if="label.value !=0" class="label-icon">
            <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 18px" :style="{color:label.color}"></font-awesome-icon>
          </span>

          <span>{{label.label}}</span>
          <span>{{label.number}}</span>
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
        },
        labelArr(){
            return this.$store.state.labelArr;
        },
        usableLabel(){
            return this.$store.getters.usableLabel;
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
      },
      setLabelNum(){
        for(var a = 0; a < this.usableLabel.length; a++){
            this.usableLabel[a].number = this.$store.getters.labelNote(this.usableLabel[a].value).length;
        }
        this.$forceUpdate()
      }
    },
    mounted(){
        setTimeout(()=>{
          this.setLabelNum()
        })
    },
    watch:{
      usableNote: {
        handler(newVal, oldVal) {
            console.log('笔记变化');
            this.setLabelNum();
            console.log(this.usableLabel)
        },
        deep: true
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
    background-color: #e7e7e7;
    width: 100%;
    overflow: auto;
  }
  .slidePage-group{
    background-color: #fff;
    /*padding:0 18px;*/
    margin-bottom: 14px;
  }
  .group-item{
    font-size: 0;
    padding:12px 18px;
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
  .group-item-num{
    color:#666
  }
  .group-item:active{
    background-color: #efefef;
  }
  .label-icon{
    position: relative;
    top: 1px;
    display: inline-block;
    margin-right: 3px;
  }

</style>
