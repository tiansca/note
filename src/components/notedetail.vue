<template>
  <div style="height: 100%">
    <div style="position: absolute;top: 0;right: 0;width: 40px;height:30px;background-color:#f8f8f8;z-index: 9 " v-show="title=='编辑笔记'" @click="saveNote">
      <font-awesome-icon :icon="['fas', 'check']" style="color: #333;font-size: 20px;margin: 10px;"></font-awesome-icon>
    </div>
    <mt-header :title="title">
      <span @click="back" slot="left">
      <mt-button icon="back"> </mt-button>
      <!--<span slot="left" @click="toggleSlide">-->
        <!--<font-awesome-icon :icon="['fas', 'bars']"></font-awesome-icon>-->
      <!--</span>-->
      </span>
      <mt-button icon="more" slot="right" style="overflow: visible;" @click="showMore">
        <div class="moreList" v-show="isShowMore">
          <div class="moreItem" @click="toggleCollect">{{aNote.collect?'取消收藏':'收藏笔记'}}</div>
          <div class="moreItem" @click="removeNote">删除笔记</div>
        </div>
      </mt-button>
    </mt-header>
    <div class="detail-top">
      <div style="margin: 2px 14px;float: left" @click="showLabel">
        <span style="position: relative;" v-if="aNote.label == 0">
          <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #333;font-size: 18px;position: absolute;top: 0;left: 0"></font-awesome-icon>
          <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #fff;font-size: 15.5px;position: absolute;top: 1px; left: 1px"></font-awesome-icon>
        </span>
        <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 18px;position: relative;" v-if="aNote.label !=0" :style="{color:aNote.color}"></font-awesome-icon>
        <span style="margin-left: 20px;font-size: 14px" :style="{marginLeft:(aNote.label==0?'20px':'0')}">{{aNote.label==0?'添加标签':aNote.labelName}}</span>
        <span style="margin-top: -3px;display: inline-block;position: relative;vertical-align: top;">
          <font-awesome-icon :icon="['fas', 'sort-down']" style="color: #333;font-size: 16px;position: absolute;top: 1px;left: 2px"></font-awesome-icon>
        </span>
      </div>

      <span style="float: right;line-height: 20px;color:#999;margin-right: 12px;font-size: 14px;margin-top: 3px;">{{aNote.time | formatDate(1)}}</span>

    </div>
    <textarea v-model="aNote.content" @focus="textFocus" @blur="textBlur" ref="inputVal">

    </textarea>


    <!--标签弹窗-->
    <mt-popup
      style="width: 100%"
      v-model="labelPopupVisible"
      position="bottom"
      modal="true"
      :closeOnClickModal="false">
      <div style="width: 100%;padding:0px 8px 8px">
        <h3 style="text-align: left">添加标签</h3>
        <div style="position: relative;;max-height: 60vh;overflow-x: auto">
          <div style="position: absolute;width: 20px;display: inline-block;top: 8px;left: 20px;z-index: 2;">
            <div v-for="item in labelArr" class="label-icon">
              <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 18px;" :style="{color:item.color}"  v-show="item.value != 0"></font-awesome-icon>
              <span style="position: relative;" v-if="item.value == 0">
                <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #333;font-size: 18px;position: absolute;top: 0;left: 0"></font-awesome-icon>
                <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #fff;font-size: 15.5px;position: absolute;top: 1px; left: 1px"></font-awesome-icon>
              </span>
            </div>
          </div>
          <mt-radio
            style="width:85%;display: inline-block;margin-left: 20px"
            align="right"
            v-model="aNote.label"
            :options="labelArr"
            @change="labelChange()">
          </mt-radio>
        </div>

        <div v-show="labelArr && labelArr.length == 0">暂无标签</div>
        <div style="color:#0d8794;line-height: 24px;padding-left: 26px" @click="addLabel" v-show="!addLabelIng">新建</div>
        <div style="width: 84%; margin: 5px 17px;display: flex;justify-content: center;align-items: center;" v-show="addLabelIng">
          <span @click="cancelAddLabel"><font-awesome-icon :icon="['fas', 'times']" style="color: #333;font-size: 20px;"></font-awesome-icon></span>
          <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 15px;margin-left: 5px;" :style="{color:addLabelColor}"></font-awesome-icon>
          <input type="text" style="width: 70%" class="addInput" v-model="addLabelName">
          <span @click="commitAddLabel"><font-awesome-icon :icon="['fas', 'check']" style="color: #333;font-size: 20px;"></font-awesome-icon></span>
        </div>
        <div @click="closePopup" style="text-align: center;color:#0d8794;margin:12px 0">取消</div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
//  import { Toast } from 'mint-ui';
  export default{
      name:'noteDetail',
      computed:{
        isShowMore(){
          return this.$store.state.showMore;
        },
        colors(){
          return this.$store.state.colors;
        },
        labelArr(){
//            console.log(this.$store.state.labelArr)
            return this.$store.state.labelArr
        },
        noteArr(){
//            console.log(this.$store.state.noteArr)
            return this.$store.state.noteArr
        }
      },
      data(){
          return {
            label:0,
            labelPopupVisible:false,
            title:'笔记',
//            labelArr:[],
            noteLabelValue:'0',
            addLabelIng:false,
            addLabelName:'',
            addLabelColor:'#333',
            aNote:{label:'0',
              time:(new Date()).valueOf(),
              collect:false,
              content:'',
              color:'#333',
              updateTime:(new Date()).valueOf(),
              status:1,
              labelName:'未标签'
            },
            oldLabel:'',
            openType:'add',
            oldContent:''
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
        toggleCollect(){
          this.aNote.collect = !this.aNote.collect;
          this.aNote.updateTime = (new Date()).valueOf();
          for(var a = 0; a < this.noteArr.length; a++){
            if(this.noteArr[a].id == this.aNote.id){
              this.noteArr[a] = this.aNote;
            }
          }
          this.$store.commit('setNoteArr', this.noteArr);
        },
//        打开弹窗
        showLabel(){
            this.labelPopupVisible = true;
            this.oldLabel = String(this.aNote.label);
        },
        //关闭弹窗
        closePopup(){
            this.labelPopupVisible = false;
            this.addLabelIng = false;
            this.aNote.label = this.oldLabel;
        },
        labelChange(){
          this.labelPopupVisible = false;
          this.addLabelIng = false;
          //查找颜色
          for(var a = 0; a < this.labelArr.length; a++){
              if(this.labelArr[a].value == this.aNote.label){
                  this.aNote.color = this.labelArr[a].color;
                  this.aNote.labelName = this.labelArr[a].label;
                  break
              }
          }
          this.aNote.updateTime = (new Date()).valueOf();
          this.$store.commit('setNoteArr', this.noteArr);
        },
        //打开新建标签
        addLabel(){
            this.addLabelIng = true;
            var colorIndex = this.labelArr.length%15==0?0:this.labelArr.length%15-1
            this.addLabelColor = this.colors[colorIndex];
        },
        //提交新建标签
        commitAddLabel(){
          if(!this.addLabelName){
            this.$toast({
              message: '标签名不能为空',
              position: 'bottom',
              duration: 3000,
              className:'toast'
            });
            return
          }
          var isExist = false;
          for(var a = 0; a < this.labelArr.length; a++){
              if(this.labelArr[a].label == this.addLabelName){
                isExist = true;
                this.$toast({
                  message: '标签名已存在',
                  position: 'bottom',
                  duration: 3000,
                  className:'toast'
                });
                break;
              }
          }
          if(isExist){
            return
          }
          var newLabelArr =[{
            value:String(this.labelArr.length),
            label:this.addLabelName,
            color:this.addLabelColor,
            status:1
          }].concat(this.labelArr)
          this.$store.commit('setLabelArr',newLabelArr);
          this.addLabelIng = false;
          this.addLabelName = '';
        },
        //取消新建
        cancelAddLabel(){
            this.addLabelIng = false;
            this.addLabelName = '';
        },
        textFocus(){
//            console.log('聚焦');
            this.title = '编辑笔记'
        },
        textBlur(){
//            console.log('失焦');
//            this.title = '笔记'
        },
        saveNote(){
            if(this.openType == 'add' && this.aNote.content == ''){
                return;
            }
            if(this.oldContent == this.aNote.content){
                this.title = '笔记';
                return;
            }
            if(this.aNote.content == ''){
                this.removeNote();
            }
            this.aNote.time = (new Date()).valueOf();
            this.updateTime = (new Date()).valueOf();
            //判断note是否已经存在
            var isExist = false;
            var currIndex = '';
            for(var a = 0; a < this.noteArr.length; a++){
                if(this.noteArr[a].id == this.aNote.id){
                    isExist = true;
                    currIndex = a;
                }
            }
            if(isExist){
                this.noteArr[currIndex] = this.aNote;
                this.$store.commit('setNoteArr', this.noteArr);
            }else {
                var newNoteArr = [this.aNote].concat(this.noteArr);
                this.$store.commit('setNoteArr', newNoteArr);
            }
            this.title = '笔记';
            this.oldContent = this.aNote.content
        },
        back(){
            if(this.title == '编辑笔记'){
                if(this.aNote.content == '' && !!this.oldContent){
                    this.aNote.content = this.oldContent;
                }
                this.saveNote();
            }
            this.$router.replace({path:'/noteList'});
        },
        //删除笔记
        removeNote(){
          this.aNote.status = 0;
          this.aNote.updateTime = (new Date()).valueOf();
          this.$store.commit('setNoteArr', this.noteArr);
          this.$router.replace({path:'/noteList'});
        }
      },
      mounted(){
        if(this.$route.query.id){
          //查找note
          this.openType = 'edit';
          console.log(this.$route.query.id)
          setTimeout(()=>{
            var isFund = false;
            for(var a = 0; a < this.noteArr.length; a++){
              if(this.noteArr[a].id == this.$route.query.id){
                  this.aNote = this.noteArr[a];
                  console.log(this.aNote);
                  this.oldContent = this.aNote.content;
                  isFund = true;
                  break
              }
            }
            if(!isFund){
              this.$router.replace({path:'/noteList'});
            }
          });
        }else {
          //新建node
          this.openType = 'add';
          setTimeout(()=>{
            this.aNote.id = this.noteArr.length + 1;
          });
          this.$refs.inputVal.focus()
        }
        //监听返回
        if (window.history && window.history.pushState) {
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.back, false);
        }
      },
      watch:{

      },
      destroyed(){
        window.removeEventListener('popstate', this.back, false);
      }
  }
</script>

<style scoped>
  textarea{
    border: none;
    margin:0;
    outline:none;
    font-size: 16px;
    line-height: 24px;
    padding:5px 12px;
    resize: none;
    width: calc(100% - 24px);
    height: calc(100% - 100px);
    overflow: auto;
    color:#464646
  }
  .addInput{
    border: none;
    border-bottom: 1px solid #999;
    outline:none;
    font-size: 16px;
    line-height: 24px;
    padding:5px;
    margin: 0 5px;
  }
  .label-icon{
    padding:14px 5px;
  }
  .detail-top{
    margin: 12px 0;
  }

</style>
