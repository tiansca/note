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
          <div class="moreItem" @click="setShowCheck" style="border-bottom: 0.5px solid #999;padding-bottom:12px;">{{filterType=='delete'?'批量恢复':'批量删除'}}</div>
          <div class="moreItem" @click="refresh">重新加载</div>
        </div>
      </mt-button>
    </mt-header>
    <span class="add-note" @click.stop="goDetaill('add')" v-show="!showCheck && !showSearch">
      <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
    </span>

    <div class="noteListBox" v-if="ready" v-loading-more="loadingMore">
        <div style="width: 100%;margin-top: 8px;text-align: center" v-show="!showSearch" :style="{marginBottom:(showType==1?'18px':'0')}">
            <input type="text" style="width: calc(100% - 27px)" class="serchInput" placeholder="搜索笔记" @focus="showSearchPage">
        </div>
      <div v-if="noteList.length == 0 && !loading" style="padding: 24px; font-size: 16px; text-align: center;color: #999">
        笔记列表为空
      </div>
      <div v-if="!note.islock && filterType !== 'lock' || note.islock && filterType === 'lock'"  v-for="(note, index) in noteList" :key="note.id" :class="showType==1?'longItem':(index%2==0?'shortItem left':'shortItem right')" :style="{marginTop:(index==0||index==1&&showSearch&&showType==1?'18px':'')}" @touchstart="touchstart(false,note,$event)" @touchend="touchend(false,note)" @touchmove="touchmove" @click="goDetaillClick(false, note)">
          <list-item :note="note" :show-type="showType" :show-check="showCheck"></list-item>
      </div>
      <div v-if="loading" style="padding: 24px; font-size: 16px; text-align: center;color: #999">
        加载中...
      </div>
      <div v-else-if="noMore && noteList.length > 0" style="padding: 24px; font-size: 16px; text-align: center;color: #999">没有更多了</div>
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
        <span style="margin: 0 30px;" @click="removeMany " v-if="filterType != 'delete'">
          <font-awesome-icon :icon="['fas', 'trash']" style="font-size: 22px;" :style="{color:deleteArr.length==0?'#999':'#444'}"></font-awesome-icon>
        </span>
        <span style="margin: 0 30px;" @click="removeMany " v-if="filterType == 'delete'">
          <font-awesome-icon :icon="['fas', 'reply']" style="font-size: 22px;" :style="{color:deleteArr.length==0?'#999':'#444'}"></font-awesome-icon>
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
          <div class="searchContent" :style="{backgroundColor:searchValue==''?'rgba(0,0,0,0.15)':'#f8f8f8'}" @click="closeSearch1" v-loading-more="searchMore">
              <div v-if="searchList.length == 0 && searchValue != '' && !loading" style="padding: 24px; font-size: 16px; text-align: center;color: #999">没有匹配的结果</div>
              <div  v-for="(note,index) in searchList" :key="note.id" :class="showType==1?'longItem':(index%2==0?'shortItem left':'shortItem right')" @click="goDetaill(false, note, true)">
<!--                  <div class="noteItem" :style="{backgroundColor:note.rgbColor}"  :class="showCheck?'show-check-item':''">-->
<!--                      <div class="note-title">-->
<!--                          <div class="note-title-line" v-html="note.content" v-if="showType==1"></div>-->
<!--                          <div v-if="showType==0" v-html="note.title"></div>-->
<!--                      </div>-->
<!--                      <div class="note-time">-->
<!--                          <span>{{note.time | formatDate}}</span>-->
<!--                          <span v-show="note.collect == 1"><font-awesome-icon :icon="['fas', 'star']" style="color: #fec000;font-size: 16px"></font-awesome-icon></span>-->
<!--                      </div>-->
<!--                  </div>-->
                  <list-item :note="note" :show-check="showCheck" :show-type="showType"></list-item>
              </div>
              <div v-if="searchValue != '' && loading && !searchNoMore" style="padding: 24px; font-size: 16px; text-align: center;color: #999">加载中...</div>
              <div v-else-if="searchValue != '' && searchList.length > 0 && searchNoMore" style="padding: 24px; font-size: 16px; text-align: center;color: #999">没有更多了</div>
          </div>
      </div>
  </div>
</template>

<script>
  import { noteUrl, loginUrl, changepasswordUrl } from "../config"
  import loadingMore from '@/directive/loadMore'
  import listItem from './listItem'
  import bus from '@/utils/bus'
  export default{
      name:'noteList',
      components: {
          listItem
      },
      directives: {
          loadingMore
      },
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
        lockNote(){
            return this.$store.getters.lockNote;
        },
        deleteNote(){
            return this.$store.getters.deleteNote;
        },
        filterType(){
          return this.$store.state.filterType;
        },
        usableLabel(){
          return this.$store.getters.usableLabel;
        },
        showSearch(){
            return this.$store.state.openSearch;
        },
        labelMap() {
          const obj = {}
          for (const label of this.usableLabel) {
            obj[label.value] = {color: label.color, name: label.label}
          }
          return obj
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
            searchList:[],
            hasTouch:false,
            pageIndex: 1,
            searchPageIndex: 1,
            loading: false,
            noMore: false,
            searchNoMore: false
          }
      },
      activated() {
        var listBox = document.querySelector('.noteListBox');
        if(sessionStorage.getItem('scrollTop') && listBox){
          listBox.scrollTop = sessionStorage.getItem('scrollTop')
          setTimeout(() => {
            this.broadcast()
          }, 100)
        } else {
          this.broadcast()
        }
      },
      methods:{
          getNote(search){
              console.log('下载')
              this.loading = true
              this.$.ajax({
                  method:"get",
                  url: noteUrl + 'note/list',
                  params:{
                    pageIndex: search ? this.searchPageIndex : this.pageIndex,
                    type: this.filterType,
                    key: search ? this.searchValue : ''
                  }
              }).then((res)=>{
                  if(res.code == 0){
                    this.loading = false
                    // this.noteList = this.noteList.concat(res.data)
                    if (search) {
                      this.searchList = this.searchList.concat(res.data)
                      if (res.data && res.data.length === 0) {
                        this.searchNoMore = true
                      }
                    } else {
                      this.noteList = this.noteList.concat(res.data)
                      if (res.data && res.data.length === 0) {
                        this.noMore = true
                      }
                    }

                    this.ready = true
                    console.log(this.noteList)
                  }
              })
          },
          loadingMore() {
            console.log('加载更多')
            if (this.loading || this.noMore) {
              return
            }
            this.pageIndex++
            this.getNote()
          },
          searchMore() {
            if (this.loading || this.searchNoMore) {
              return
            }
            this.searchPageIndex++
            this.getNote('search')
          },
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
        goDetaill(add,note,search){
            console.log(add, note)
            if(this.showCheck){
                this.checkNote(note);
                return
            }
            if(add == 'add'){
                this.$router.push({path:'./noteDetail'})
            }else if(this.filterType == 'delete'){
                console.log(this.$messageBox.confirm)
                setTimeout(()=>{
                    this.$messageBox.confirm('确定要恢复该笔记吗？').then(async action => {
                      await this.$.ajax({
                        url: noteUrl + 'note/delete',
                        method: 'get',
                        params: {
                          id: note.id,
                          status: 1
                        }
                      })
                      this.refresh()
                      bus.$emit('getCount')
                    }).catch(action=>{
                        return false;
                    });
                },200)

            }else {
                console.log('ontouchstart' in document)
                if(('ontouchstart' in document) && !search){
                    return;
                }
                this.$router.push({
                    name:'noteDetail',
                    query: {
                        id: note.id
                    }
                })
            }
        },
          goDetaillClick(add,note){
              if(this.hasTouch){
                  return false;
              }
              this.goDetaill(add,note)
          },
        hexToRgb(hex) {
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          // return result ? {
          //   r: parseInt(result[1], 16),
          //   g: parseInt(result[2], 16),
          //   b: parseInt(result[3], 16)
          // } : null;
          if (result) {
            return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, 0.2)`
          }
          return 'none'
          //   g: parseInt(result[2], 16),
          //   b: parseInt(result[3], 16)
        },
        setShowCheck(){
            this.showCheck = !this.showCheck;
        },
        checkNote(note){
            /*tiansc*/
            this.showCheck = false
            // note.check = !note.check;
            this.$set(note, 'check', !note.check)
            this.showCheck = true
//            console.log(note);
            if(note.check){
                this.deleteArr.push(note);
            }else {
                for(var a = 0; a < this.deleteArr.length; a++){
                    if(this.deleteArr[a].user_note_id == note.user_note_id && this.deleteArr[a].device_id == note.device_id){
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
                  // this.noteList[a].check = false;
                  this.$set(this.noteList[a], 'check', false)
                }
                this.deleteArr = []
            }else {
                this.selectAll = true;
                for(var a = 0; a < this.noteList.length; a++){
                  // this.noteList[a].check = true;
                    this.$set(this.noteList[a], 'check', true)
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
            let status = 0
            if(this.filterType == 'delete'){
                var msg = '确定要恢复选中的' + this.deleteArr.length +'项吗？'
                status = 1
            }else {
                var msg = '确定要将'+ this.deleteArr.length +'项吗放入回收站吗？<br>20天后自动彻底删除'
            }
            this.$messageBox.confirm(msg).then(async action => {
              if (action == 'confirm') {
                const deleteIdArr = this.deleteArr.map(item => {
                  return item.id
                })
                await this.$.ajax({
                  url: noteUrl + 'note/delete',
                  method: 'get',
                  params: {
                    id: deleteIdArr.join(','),
                    status: status
                  }
                })
                bus.$emit('getCount')
                this.refresh()
                this.showCheck = false;
              } else {
                return false;
              }
            }).catch(action=>{
                return false;
            });
        },
      // 长按
        touchstart(add,note,e){
            console.log('ontouchstart' in document)
            this.hasTouch = true;
            this.isMove = false;
            this.clicKTime = (new Date()).valueOf();
            this.timer = setTimeout(()=> {
                if(this.isMove){
                    return;
                }
              this.setShowCheck();
                this.checkNote(note);
                this.isMove = true
            },600)
            // e.preventDefault()
        },
        touchend(isAdd, note){
              setTimeout(()=>{
                  this.hasTouch = false;
              },800);
            if(this.isMove){
                return;
            }
            if((new Date()).valueOf() - this.clicKTime < 600){
                clearTimeout(this.timer)
            }
            if(this.showCheck){
                this.checkNote(note);
                return
            }
            if((new Date()).valueOf() - this.clicKTime < 300){
                // this.goDetaill(isAdd, note)
                if(this.filterType == 'delete'){
                    // console.log(this.$messageBox.confirm)
                    setTimeout(()=>{
                        this.$messageBox.confirm('确定要恢复该笔记吗？').then(async action => {
                          await this.$.ajax({
                            url: noteUrl + 'note/delete',
                            method: 'get',
                            params: {
                              id: note.id,
                              status: 1
                            }
                          })
                          this.refresh()
                          bus.$emit('getCount')
                        }).catch(action=>{
                            return false;
                        });
                    },200)

                }else {
                    this.$router.push({
                        name:'noteDetail',
                        query: {
                            id: note.id
                        }
                    })
                }
            }
        },
          touchmove(){
            clearTimeout(this.timer);
            this.isMove = true;
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
          closeSearch1(){
              if(!this.searchValue){
                  this.closeSearch();
              }
          },
          removeSearchValue(){
              this.searchValue = '';
          },
          refresh(){
            this.noteList = []
            this.pageIndex = 1
            this.noMore = false
            this.getNote()
          },
          getStyle(obj, attr){
              if(!obj || !this.isDom(obj) || obj.nodeName=='#text'){
                  return false
              }
              if (obj.currentStyle) {
                  return obj.currentStyle[attr];
              }
              else {
                  return getComputedStyle(obj, false)[attr];
              }
          },
          isDom(obj){
              return !!(obj && typeof window !== 'undefined' && (obj === window || obj.nodeType));
          },
          broadcast(e) {
              this.$broadcast('scroll')
              console.log('滚动')
          },
          initScroll() {
            setTimeout(()=>{
              //监听滚动
              var listBox = document.querySelector('.noteListBox');
//            console.log(listBox)
              if (!listBox) {
                return
              }
              listBox.onscroll = ()=>{
//                console.log('正在滚动');
//                console.log(listBox.scrollTop);
                if(listBox.scrollTop){
                  sessionStorage.setItem('scrollTop',listBox.scrollTop);
                }else {
                  sessionStorage.setItem('scrollTop',0);
                }
                this.isMove = true;
                this.broadcast()

//                listBox.scrollTop = listBox.scrollTop + 50
              }
              if(sessionStorage.getItem('scrollTop')){
                listBox.scrollTop = sessionStorage.getItem('scrollTop')
                setTimeout(() => {
                  this.broadcast()
                }, 100)
              }
            },80);
          },
        async update(val) {
          console.log('更新', val)
          if (!val) {
            return
          }
          if (val.type === 'one') {
            const res = await this.$.ajax({
              url: noteUrl + 'note/detail',
              params: {
                id: val.id
              }
            })
            const note = res.data
            console.log(note)
            const oldContent = note.content
            note.content = note.content.replace(/<[^>]+>/g,"").slice(0, 50)
            oldContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
              note.content += match
            });
            for (let a = 0; a < this.noteList.length; a++) {
              if (this.noteList[a].id === note.id) {
                this.$set(this.noteList, a, note)
                break
              }
            }
            this.noteList.sort((a, b) => {
              if (Number(a.updateTime) > Number(b.updateTime)) {
                return -1
              }
              return 1
            })
            this.broadcast()
          } else {
            this.noteList = []
            this.pageIndex = 1
            this.noMore = false
            this.getNote()
          }
        }
      },
      mounted(){
        const _this = this
        setTimeout(()=>{
//           var rgbColor = this.hexToRgb(this.noteArr[a].color);
// //            console.log(rgbColor)
//           if(rgbColor && this.noteArr[a].color != '#333333'){
//             this.noteArr[a].rgbColor = "rgba(" + rgbColor.r + ',' + rgbColor.g + ',' + rgbColor.b + ', 0.15' + ")";
//           }else {
//             this.noteArr[a].rgbColor = "#fff"
//           }
        },50);
        bus.$off('update', this.update)
        bus.$on('update', this.update)
      },
      watch:{
        showCheck(){
            /*tiansc*/
            if(this.showCheck == false){
                this.selectAll = false;
                for(var a = 0; a < this.noteList.length; a++){
                  // this.noteList[a].check = false;
                  this.$set(this.noteList[a], 'check', false)
                }
                this.deleteArr = []
            }
        },
        filterType: {
          handler(n) {
            this.noteList = []
            this.pageIndex = 1
            this.noMore = false
            this.getNote()
            console.log(this.noteList)
            if (n === 'all') {
              this.filterTitle = '全部笔记'
            } else if (n === 'delete') {
              this.filterTitle = '回收站'
            } else if (n === 'like') {
              this.filterTitle = '我的收藏'
            } else if (n === 'lock') {
              this.filterTitle = '我的加密'
            } else if(n.indexOf('tag') !== -1) {
              const label = n.split('_')[1]
              if (this.labelMap[label]) {
                this.filterTitle = this.labelMap[label].name
              }
            }
          },
          immediate: true
        },
          searchValue(){
            if(this.searchValue && this.searchValue != ''){
                this.searchList = []
                this.searchPageIndex = 1
                this.searchNoMore = false
                this.getNote('search')
                this.$nextTick(() => {
                    this.$broadcast('scroll')
                })
            }else {
                this.searchList = [];
            }
          },
          usableLabel(){
              // this.initNote()
          },
          showSearch(n) {
            if(n) {
                setTimeout(() => {
                    document.querySelector('.searchContent').addEventListener('scroll', this.broadcast)
                },100)
            } else {
                document.querySelector('.searchContent').removeEventListener('scroll', this.broadcast)
            }
          },
          ready(n) {
            if (n) {
              this.initScroll()
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
    bottom: 100px;
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
    /*margin-bottom:16px;*/
    padding:8px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      position: relative;
  }
  .note-title{
    font-size: 16px;
    line-height: 28px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    color: #444;
    font-weight: 400;
      /*height: 40px;*/
  }
  /deep/ .note-time{
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
  .longItem:last-of-type,/deep/ .shortItem:last-of-type{
    margin-bottom: 80px;
  }
  .longItem{
      margin-top: 18px;
      min-height: 68px;
  }
  /deep/.longItem .show-check-item{
    width: 85%;
    display: inline-block;
  }
  /deep/ .longItem .item-checkbox{
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
  /deep/ .shortItem{
    width: 47%;
    height: 133px;
    /*display: inline-block;*/
    /*margin:12px 4%;*/
    margin-bottom:18px;
    margin-top:18px;
    position: relative;
    /*float: left;*/
  }
  /deep/ .shortItem.right{
    float: right;
  }
  /deep/ .shortItem.left{
      float: left;
  }
  /deep/ .shortItem .noteItem{
    height: 100%;
  }
  /deep/ .shortItem .noteItem .note-title{
    height: 108px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:normal;
    line-height: 27px;
    word-wrap: break-word;
      text-align: left!important;
  }
  /deep/ .shortItem .item-checkbox{
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
    /deep/ .note-title-line{
        /*overflow:hidden;*/
        text-overflow:ellipsis;
        white-space:nowrap;
        height: 28px;
        line-height: 28px;
        width: calc(100% - 60px);
        overflow: hidden;
    }
  /deep/ .note-title-line pre{
      margin-top:0!important;
  }
  /deep/ .note-title-line ul,/deep/ .note-title-line ol,/deep/ .note-title-line h1,/deep/ .note-title-line h2,/deep/ .note-title-line h3,/deep/ .note-title-line h4,/deep/ .note-title-line h5,/deep/ .note-title-line h6,/deep/ .note-title-line b,/deep/ .note-title-line i,/deep/ .note-title-line div,/deep/ .note-title-line font,/deep/ .note-title-line u,/deep/ .note-title-line strike,/deep/ .note-title-line sup,/deep/ .note-title-line sub,/deep/ .note-title-line span{
      padding:0;
      margin:0;
      font-size: 16px!important;
      color: #444!important;
      font-weight: 400;
      text-align: left!important;
      font-style:normal;
      background-color: rgba(255,255,255,0)!important;
      line-height: 28px!important;
      text-decoration: none;
      vertical-align:middle!important;
  }
  /deep/ .note-title-line font{
      margin-top: -4px;
      display: inline-block;
  }
  .vue-html5-editor .content{
      height: 100%;
  }
  /deep/ .note-title-line pre{
      margin-top:0!important;
      font-family:"Helvetica Neue",Helvetica,"PingFang SC"
  }

</style>
<style>
    .noteItem .note-title-line>img{
        max-width: 50px;
        max-height: 50px;
        position: absolute;
        right: 12px;
        top: 6px;
        z-index: 1;
        /*border: 1px solid;*/
    }
</style>
