<template>
  <div style="background-color: #f8f8f8;height: 100%">
    <mt-header title="全部笔记">
      <!--<router-link to="/noteList" slot="left">-->
        <!--<mt-button icon="back"> </mt-button>-->
      <span slot="left" @click="toggleSlide">
        <font-awesome-icon :icon="['fas', 'bars']"></font-awesome-icon>
      </span>
      <!--</router-link>-->
      <mt-button icon="more" slot="right" style="overflow: visible;" @click="showMore">
        <div class="moreList" v-show="isShowMore">
          <div class="moreItem" @click="listShowType">列表视图</div>
          <div class="moreItem">批量删除</div>
        </div>
      </mt-button>
    </mt-header>
    <span class="add-note" @click="goDetaill('add')">
      <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
    </span>
    <div class="noteListBox" v-if="ready">
      <div class="noteItem" v-for="note in noteArr" :style="{backgroundColor:note.rgbColor}" @click="goDetaill(false,note)">
        <div class="note-title">{{note.title}}</div>
        <div class="note-time">
          <span>{{note.time | formatDate}}</span>
          <span v-show="note.collect"><font-awesome-icon :icon="['fas', 'star']" style="color: #FFDC35;font-size: 16px"></font-awesome-icon></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
      name:'noteList',
      computed:{
        isShowMore(){
            return this.$store.state.showMore;
        },
        noteArr(){
          return this.$store.state.noteArr
        }
      },
      data(){
          return{
            msg:'note list',
            ready:false,
          }
      },
      methods:{
          toggleSlide(){
              this.$store.commit('setSlide');
              this.$store.commit('setGlobalBg');
          },
          showMore(){
            this.$store.commit('setGlobalBg',0);
            this.$store.commit('setShowMore')
          },
        listShowType(){
//              console.log('aaaaaaaaa')
        },
        goDetaill(add,note){
            if(add == 'add'){
                this.$router.push({path:'./noteDetail'})
            }else {
                this.$router.push({
                  name:'noteDetail',
                  query: {
                    id: note.id
                  }
                })
            }
        },
        hexToRgb(hex) {
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;
        }
      },
      mounted(){
        setTimeout(()=>{
          for(var a = 0; a < this.noteArr.length; a++){
            var content = this.noteArr[a].content.split(/[\s\n]/)[0];
//            console.log(content)
            this.noteArr[a].title = content;
            var rgbColor = this.hexToRgb(this.noteArr[a].color);
//            console.log(rgbColor)
            if(rgbColor && this.noteArr[a].color != '#333333'){
              this.noteArr[a].rgbColor = "rgba(" + rgbColor.r + ',' + rgbColor.g + ',' + rgbColor.b + ', 0.15' + ")";
            }else {
              this.noteArr[a].rgbColor = "#fff"
            }
//
//            console.log(this.noteArr[a].rgbColor)
          }
          this.ready = true
        })
      },
      watch:{

      }
  }
</script>
<style scoped>
  .add-note{
    font-size: 24px;
    font-weight: lighter;
    position: fixed;
    right: 20px;
    bottom: 80px;
    padding: 8px;
    border-radius: 50%;
    box-shadow: 0 0 8px 1px rgba(0,0,0,0.2);
    display: inline-flex;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  /*.add-note>*/
  .noteListBox{
    height: calc(100% - 64px);
    width: calc(100% - 24px);
    padding:12px;
  }
  .noteItem{
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 0 8px 0px rgba(0,0,0,0.2);
    margin-bottom:16px;
    padding:8px;
  }
  .note-title{
    font-size: 18px;
    line-height: 28px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .note-time{
    font-size: 14px;
    line-height: 24px;
    color: #757575;
  }
</style>
