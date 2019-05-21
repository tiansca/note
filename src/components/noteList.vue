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
          <div class="moreItem" @click="listShowType">{{showType==1?'宫格视图':'列表视图'}}</div>
          <div class="moreItem" @click="setShowCheck">批量删除</div>
        </div>
      </mt-button>
    </mt-header>
    <span class="add-note" @click.stop="goDetaill('add')" v-show="!showCheck && !showSearch">
      <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
    </span>

    <div class="noteListBox" v-if="ready">
        <div style="width: 100%;margin-top: 8px;text-align: center" v-show="!showSearch" :style="{marginBottom:(showType==1?'18px':'0')}">
            <input type="text" style="width: calc(100% - 27px)" class="serchInput" placeholder="搜索笔记" @focus="showSearchPage">
        </div>
      <div v-if="noteList.length == 0" style="padding: 24px; font-size: 16px; text-align: center;color: #999">
        笔记列表为空
      </div>
      <div  v-for="(note, index) in noteList" :class="showType==1?'longItem':(index%2==0?'shortItem left':'shortItem right')" :style="{marginTop:(index==0||index==1&&showSearch&&showType==1?'18px':'')}" @touchstart="touchstart(false,note,$event)" @touchend="touchend(false,note)" @touchmove="touchmove" @click="goDetaill(false, note)">
        <div class="noteItem" :style="{backgroundColor:note.rgbColor}"  :class="showCheck?'show-check-item':''">
          <div class="note-title">{{showType==1?note.title:note.content}}</div>
          <div class="note-time">
            <span>{{note.time | formatDate}}</span>
            <span v-show="note.collect"><font-awesome-icon :icon="['fas', 'star']" style="color: #fec000;font-size: 16px"></font-awesome-icon></span>
          </div>
        </div>
        <span class="item-checkbox" v-show="showCheck">
          <font-awesome-icon :icon="['fas', 'check-square']" style="display:inline-block;width: 24px;height: 24px; color: #0d8794" v-if="note.check"></font-awesome-icon>
          <font-awesome-icon :icon="['fas', 'square']" :style="{color:(showType==1?'#fff':'rgba(225,225,225,0)')}" style="border-radius: 2px;border:1px solid #0d8794;display: inline-block;width: 20px;height: 20px" v-else></font-awesome-icon>
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

      <!--搜索页面-->
      <div v-if="showSearch" id="searchPage">
          <div class="searchHead">
              <button data-v-65f5bf53="" class="mint-button mint-button--default mint-button--normal" style="box-shadow:none" @click="closeSearch"><span class="mint-button-icon"><i class="mintui mintui-back"></i></span> <label class="mint-button-text"></label></button>
              <input type="text" class="serchInput" placeholder="搜索笔记" style="width: calc(100% - 93px)" v-model="searchValue" ref="serchInput">
              <span style="color: #515151;position: absolute;right: 25px;top: 0px;padding: 3px;" v-if="searchValue" @click="removeSearchValue">
                <font-awesome-icon :icon="['fas', 'times']" style="color:#333"></font-awesome-icon>
              </span>
          </div>
          <div class="searchContent" :style="{backgroundColor:searchValue==''?'rgba(0,0,0,0.15)':'#f8f8f8'}">
              <div v-if="searchList.length == 0 && searchValue != ''" style="padding: 24px; font-size: 16px; text-align: center;color: #999">没有匹配的结果</div>
              <div  v-for="(note,index) in searchList" :class="showType==1?'longItem':(index%2==0?'shortItem left':'shortItem right')" @click="goDetaill(false, note)">
                  <div class="noteItem" :style="{backgroundColor:note.rgbColor}"  :class="showCheck?'show-check-item':''">
                      <div class="note-title">{{showType==1?note.title:note.content}}</div>
                      <div class="note-time">
                          <span>{{note.time | formatDate}}</span>
                          <span v-show="note.collect"><font-awesome-icon :icon="['fas', 'star']" style="color: #fec000;font-size: 16px"></font-awesome-icon></span>
                      </div>
                  </div>
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
        usableLabel(){
          return this.$store.getters.usableLabel;
        },
          showSearch(){
              return this.$store.state.openSearch;
          }
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
            noteList:[],
              isMove:false,
              searchValue:'',
              searchList:[]
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
            console.log(add)
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
                console.log(this.usableNote);
                this.usableNote = this.usableNote.concat()
                this.$forceUpdate();
            }
            this.showCheck = false;
            this.filterNote()
        },
      // 长按
        touchstart(add,note,e){
            this.isMove = false;
            this.clicKTime = (new Date()).valueOf();
            this.timer = setTimeout(()=> {
              this.setShowCheck();
                this.checkNote(note)
            },600)
            e.preventDefault()
        },
        touchend(isAdd, note){
            if(this.isMove){
                return;
            }
            if((new Date()).valueOf() - this.clicKTime < 200){
                this.goDetaill(isAdd, note)
            }
            if((new Date()).valueOf() - this.clicKTime < 600){
              clearTimeout(this.timer)
            }
        },
          touchmove(){
            clearTimeout(this.timer);
            this.isMove = true;
          },
        filterNote(){
          if(this.filterType == 'all'){
            this.filterTitle='全部笔记';
            this.noteList = this.usableNote.sort(function (a,b) {
                var val1 = Number(a.time);
                var val2 = Number(b.time);
                if (val1 < val2) {
                    return 1;
                } else if (val1 > val2) {
                    return -1;
                } else {
                    return 0;
                }
            });
          }else if(this.filterType == 'collect'){
            this.filterTitle = '我的收藏';
            this.noteList = this.collectNote.sort(function (a,b) {
                var val1 = Number(a.time);
                var val2 = Number(b.time);
                if (val1 < val2) {
                    return 1;
                } else if (val1 > val2) {
                    return -1;
                } else {
                    return 0;
                }
            });
          }else {
            for(var a = 0; a < this.usableLabel.length; a++){
              if(this.filterType == this.usableLabel[a].value){
                this.filterTitle = this.usableLabel[a].label;
                this.noteList = this.$store.getters.labelNote(this.filterType).sort(function (a,b) {
                    var val1 = Number(a.time);
                    var val2 = Number(b.time);
                    if (val1 < val2) {
                        return 1;
                    } else if (val1 > val2) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
              }
            }
          }
        },
          //打开搜索页面
          showSearchPage(){
            this.$store.commit('setOpenSearch');
            setTimeout(()=>{
                this.$refs.serchInput.focus();
            })
          },
          closeSearch(){
              this.$store.commit('setOpenSearch');
              this.searchValue = ''
          },
          removeSearchValue(){
              this.searchValue = '';
          }
      },
      mounted(){
        setTimeout(()=>{
            console.log(this.usableLabel)
          if(this.isShowMore){
            this.$store.commit('setShowMore')
          }
          for(var a = 0; a < this.noteArr.length; a++){
            var content = this.noteArr[a].content.split(/[\s\n]/)[0];
//            console.log(content)
            this.noteArr[a].title = content;
            var hasLabel = false;
            if(this.usableLabel){
              for(var b = 0; b < this.usableLabel.length; b++){
                if(this.noteArr[a].label == this.usableLabel[b].value){
                  hasLabel = true;
                  this.noteArr[a].color = this.usableLabel[b].color
                }
              }
            }
            if(!hasLabel){
                this.noteArr[a].label = '0';
                this.noteArr[a].color = '#333';
            }
            //设置颜色
            var rgbColor = this.hexToRgb(this.noteArr[a].color);
//            console.log(rgbColor)
            if(rgbColor && this.noteArr[a].color != '#333333'){
              this.noteArr[a].rgbColor = "rgba(" + rgbColor.r + ',' + rgbColor.g + ',' + rgbColor.b + ', 0.15' + ")";
            }else {
              this.noteArr[a].rgbColor = "#fff"
            }
          }
          this.$store.commit('setNoteArr', this.noteArr)
          this.noteList = this.usableNote.sort(function (a,b) {
              var val1 = Number(a.time);
              var val2 = Number(b.time);
              if (val1 < val2) {
                  return 1;
              } else if (val1 > val2) {
                  return -1;
              } else {
                  return 0;
              }
          });
          this.ready = true;
          this.filterNote();

          //获取查询关键词
            if(this.showSearch){
                this.searchValue = sessionStorage.getItem('searchValue');
                this.$refs.serchInput.focus()
            }
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
        },
        usableNote(){
					for(var a = 0; a < this.noteArr.length; a++){
							var content = this.noteArr[a].content.split(/[\s\n]/)[0];
	//            console.log(content)
							this.noteArr[a].title = content;
							var hasLabel = false;
							if(this.usableLabel){
								for(var b = 0; b < this.usableLabel.length; b++){
									if(this.noteArr[a].label == this.usableLabel[b].value){
										hasLabel = true;
										this.noteArr[a].color = this.usableLabel[b].color
									}
								}
							}
							if(!hasLabel){
									this.noteArr[a].label = '0';
									this.noteArr[a].color = '#333';
							}
							//设置颜色
							var rgbColor = this.hexToRgb(this.noteArr[a].color);
	//            console.log(rgbColor)
							if(rgbColor && this.noteArr[a].color != '#333333'){
								this.noteArr[a].rgbColor = "rgba(" + rgbColor.r + ',' + rgbColor.g + ',' + rgbColor.b + ', 0.15' + ")";
							}else {
								this.noteArr[a].rgbColor = "#fff"
							}
						}
						this.$store.commit('setNoteArr', this.noteArr)
						this.noteList = this.usableNote.sort(function (a,b) {
                            var val1 = Number(a.time);
                            var val2 = Number(b.time);
                            if (val1 < val2) {
                                return 1;
                            } else if (val1 > val2) {
                                return -1;
                            } else {
                                return 0;
                            }
                        });
						this.ready = true;
						this.filterNote();
        },
          searchValue(){
            if(this.searchValue && this.searchValue != ''){
                sessionStorage.setItem('searchValue', this.searchValue);
                this.searchList = [];
                for(var a = 0; a < this.noteList.length; a++){
                    if(this.noteList[a].content.indexOf(this.searchValue) > -1){
                        this.searchList.push(this.noteList[a])
                    }
                }
            }else {
                this.searchList = [];
            }
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
      z-index: 2;
  }
  /*.add-note>*/
  .noteListBox{
    height: calc(100% - 68px);
    width: calc(100% - 36px);
    padding:0 18px;
      padding-bottom: 18px;
      overflow: auto;
  }
  .noteItem{
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 0 8px 0px rgba(0,0,0,0.2);
    margin-bottom:16px;
    padding:8px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
  }
  .note-title{
    font-size: 16px;
    line-height: 28px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    color: #333;
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
  .longItem:last-of-type,.shortItem:last-of-type{
    margin-bottom: 80px;
  }
  .longItem{
      /*margin-top: 18px;*/
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
    width: 47%;
    height: 133px;
    /*display: inline-block;*/
    /*margin:12px 4%;*/
    margin-bottom:18px;
    margin-top:18px;
    position: relative;
    /*float: left;*/
  }
  .shortItem.right{
    float: right;
  }
  .shortItem.left{
      float: left;
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
    .serchInput{
        padding: 8px 12px;
        outline: none;
        border-radius: 5px;
        border:1px solid #d8d8d8;
        font-size: 14px;
    }
    #searchPage{
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left: 0;
    }
    .searchHead{
        background-color: #f8f8f8;
        height: 50px;
        line-height: 50px;
        position: relative;
    }
    .searchContent{
        width:  calc(100% - 36px);
        height: calc(100% - 50px);
        padding:0 18px;
        padding-bottom: 18px;
        overflow: auto;
    }
</style>
