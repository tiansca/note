<template>
  <div style="background-color: #f8f8f8;height: 100%">
    <mt-header :title="filterTitle">
      <!--<router-link to="/noteList" slot="left">-->
        <!--<mt-button icon="back"> </mt-button>-->
      <span slot="left" @click="toggleSlide">
        <font-awesome-icon :icon="['fas', 'bars']"></font-awesome-icon>
      </span>
      <!--</router-link>-->
      <mt-button icon="more" slot="right" style="overflow: visible;" @click="showMore">
        <div class="moreList" v-show="isShowMore">
          <div class="moreItem" @click="listShowType">{{showType?'宫格视图':'列表视图'}}</div>
          <div class="moreItem" @click="setShowCheck">批量删除</div>
        </div>
      </mt-button>
    </mt-header>
    <span class="add-note" @click="goDetaill('add')" v-show="!showCheck">
      <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
    </span>
    <div class="noteListBox" v-if="ready">
      <div v-if="usableNote.length == 0" style="padding: 24px; font-size: 16px; text-align: center;color: #999">
        笔记列表为空
      </div>
      <div  v-for="note in noteList" :class="showType?'longItem':'shortItem'" @touchstart="touchstart(false,note)" @touchend="touchend(false,note)">
        <div class="noteItem" :style="{backgroundColor:note.rgbColor}"  :class="showCheck?'show-check-item':''">
          <div class="note-title">{{showType?note.title:note.content}}</div>
          <div class="note-time">
            <span>{{note.time | formatDate}}</span>
            <span v-show="note.collect"><font-awesome-icon :icon="['fas', 'star']" style="color: #fec000;font-size: 16px"></font-awesome-icon></span>
          </div>
        </div>
        <span class="item-checkbox" v-show="showCheck" @click="checkNote(note)">
          <font-awesome-icon :icon="['fas', 'check-square']" style="display:inline-block;width: 24px;height: 24px; color: #0d8794" v-if="note.check"></font-awesome-icon>
          <font-awesome-icon :icon="['fas', 'square']" style="color: #fff;border-radius: 2px;border:1px solid #0d8794;display: inline-block;width: 20px;height: 20px" v-else></font-awesome-icon>
        </span>
      </div>
    </div>
    <!--批量操作head-->
    <div class="check-show-head" v-show="showCheck">
      <span style="margin-left: 12px;padding-top: 5px;" @click="setShowCheck">
        <font-awesome-icon :icon="['fas', 'times']" style="color: #333;font-size: 20px;margin: 5px;"></font-awesome-icon>
      </span>
      <span style="margin-left: 8px;">{{deleteArr.length==0?'未选择':'已选择 ' + deleteArr.length + " 项"}}</span>
    </div>

    <!--批量删除footer-->
    <div class="check-show-footer" v-show="showCheck">
        <span style="margin: 0 30px;" @click="removeMany ">
          <font-awesome-icon :icon="['fas', 'trash']" style="font-size: 22px;" :style="{color:deleteArr.length==0?'#999':'#444'}"></font-awesome-icon>
        </span>
        <span style="margin: 0 30px;" @click="toggleSelectAll">
          <img src="../assets/select.png" alt="" style="width: 24px" v-show="!selectAll">
          <img src="../assets/selectAll.png" alt="" style="width: 24px" v-show="selectAll">
        </span>
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
        },
        usableNote(){
          return this.$store.getters.usableNote;
        },
        showType(){
          return this.$store.state.showType;
        },
        collectNote(){
          return this.$store.getters.collectNote;
        },
        filterType(){
          return this.$store.state.filterType;
        },
      },
      data(){
          return{
            msg:'note list',
            ready:false,
            // showType:true,
            showCheck:false,
            deleteArr:[],
            selectAll:false,
            clickTime:'',
            timer:'',
            filterTitle:'全部笔记',
            noteList:[]
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
            this.$store.commit('setShowType')
        },
        goDetaill(add,note){
            if(this.showCheck){
                this.checkNote(note);
                return
            }
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
        },
        setShowCheck(){
            this.showCheck = !this.showCheck;
        },
        checkNote(note){
            /*tiansc*/
            this.showCheck = false
            note.check = !note.check;
            this.showCheck = true
            console.log(note);
            if(note.check){
                this.deleteArr.push(note);
            }else {
                for(var a = 0; a < this.deleteArr.length; a++){
                    if(this.deleteArr[a].id == note.id){
                        this.deleteArr.splice(a,1);
                        break
                    }
                }
            }
        },
        toggleSelectAll(){
            /*tiansc*/
            this.showCheck = false;
            if(this.selectAll){
                this.selectAll = false;
                for(var a = 0; a < this.noteList.length; a++){
                  this.noteList[a].check = false;
                }
                this.deleteArr = []
            }else {
                this.selectAll = true;
                for(var a = 0; a < this.noteList.length; a++){
                  this.noteList[a].check = true;
                }
                this.deleteArr = this.noteList.concat()
            }
            this.showCheck = true
        },
        //批量删除
        removeMany(){
            if(this.deleteArr.length == 0){
                return
            }
            for(var a = 0; a < this.deleteArr.length; a++){
                for(var b = 0; b < this.noteArr.length; b++){
                    if(this.deleteArr[a].id == this.noteArr[b].id){
                        this.noteArr[b].status = 0;
                    }
                }
                this.$store.commit('setNoteArr', this.noteArr);
            }
            this.showCheck = false
        },
      // 长按
        touchstart(){
            this.clicKTime = (new Date()).valueOf();
            console.log(this.clicKTime);
            this.timer = setTimeout(()=> {
              this.setShowCheck()
            },600)
        },
        touchend(isAdd, note){
            console.log((new Date()).valueOf() - this.clicKTime);
            if((new Date()).valueOf() - this.clicKTime < 200){
                this.goDetaill(isAdd, note)
            }
            if((new Date()).valueOf() - this.clicKTime < 600){
              clearTimeout(this.timer)
            }
        },
        filterNote(){
          switch (this.filterType){
            case 'all':
              this.filterTitle='全部笔记';
              this.noteList = this.usableNote;
              break;
            case 'collect':
              this.filterTitle = '我的收藏';
              this.noteList = this.collectNote;
              break;
          }
        }
      },
      mounted(){
        console.log(this.$store.getters.collectNote)
        setTimeout(()=>{
            console.log(this.isShowMore)
          if(this.isShowMore){
            this.$store.commit('setShowMore')
          }
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
            this.noteList = this.usableNote;
//
//            console.log(this.noteArr[a].rgbColor)
          }
          this.ready = true;
          this.filterNote();
        });

      },
      watch:{
        showCheck(){
            /*tiansc*/
            if(this.showCheck == false){
                this.selectAll = false;
                for(var a = 0; a < this.noteList.length; a++){
                  this.noteList[a].check = false;
                }
                this.deleteArr = []
            }
        },
        filterType(){
          this.filterNote();
        }
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
  .check-show-head{
    height: 39px;
    width: 100%;
    position: fixed;
    top:0;
    left: 0;
    background-color: #f8f8f8;
    z-index: 2;
    /*line-height: 39px;*/
    display: flex;
    align-items: center;
    padding-top:1px;
  }
  .longItem:last-of-type{
    margin-bottom: 80px;
  }
  .longItem .show-check-item{
    width: 85%;
    display: inline-block;
  }
  .longItem .item-checkbox{
    /*vertical-align: middle;*/
    position: relative;
    top: -10px;
    left: 10px;
  }
  .check-show-footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 40px;
    left: 0px;
    background-color: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* 宫格视图 */
  .shortItem{
    width: 42%;
    height: 133px;
    display: inline-block;
    margin:12px 4%;
    position: relative;
  }
  .shortItem .noteItem{
    height: 100%;
  }
  .shortItem .noteItem .note-title{
    height: 108px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    white-space:normal;
    line-height: 26px;
  }
  .shortItem .item-checkbox{
    position: absolute;
    bottom: -6px;
    right: 12px;
  }
</style>
