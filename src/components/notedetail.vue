<template>
  <div style="height: 100%">
    <div style="position: absolute;top: 0;right: 0;width: 40px;height:50px;background-color:#f8f8f8;z-index: 9 " v-show="title=='编辑笔记'" @click="saveNote">
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
          <div class="moreItem" @click="toggleCollect">{{aNote.collect==1?'取消收藏':'收藏笔记'}}</div>
          <div class="moreItem" @click="toggleLock" style="border-bottom: 0.5px solid rgb(153, 153, 153);padding-bottom: 12px;">{{aNote.islock==1?'取消加密':'加密笔记'}}</div>
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
        <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 18px;position: relative;" v-if="aNote.label !=0" :style="{color:labelMap[aNote.label] ? labelMap[aNote.label].color : '#999'}"></font-awesome-icon>
        <span style="margin-left: 20px;font-size: 14px" :style="{marginLeft:(aNote.label==0?'20px':'0')}">{{aNote.label==0?'添加标签':labelMap[aNote.label] ? labelMap[aNote.label].name : ''}}</span>
        <span style="margin-top: -3px;display: inline-block;position: relative;vertical-align: top;">
          <font-awesome-icon :icon="['fas', 'sort-down']" style="color: #333;font-size: 16px;position: absolute;top: 1px;left: 2px"></font-awesome-icon>
        </span>
      </div>

      <span style="float: right;line-height: 20px;color:#999;margin-right: 12px;font-size: 14px;margin-top: 3px;">{{aNote.updateTime | formatDate(1)}}</span>

    </div>
    <!--<textarea v-model="aNote.content" @focus="textFocus" @blur="textBlur" ref="inputVal"></textarea>-->
      <vue-html5-editor :content="aNote.content" ref="inputVal" :z-index="1000" :auto-height="true" :show-module-name="false" @change="textFocus"></vue-html5-editor>


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
          <div style="position: absolute;width: 20px;display: inline-block;top: 6px;left: 20px;z-index: 2;font-size: 0">
            <div v-for="item in usableLabel" class="label-icon">
              <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 18px;" :style="{color:item.color}"  v-show="item.value != 0"></font-awesome-icon>
              <span style="position: relative;width: 13.5px;height: 18px;display: inline-block" v-if="item.value == 0">
                <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #333;font-size: 18px;position: absolute;top: 0;left: 0"></font-awesome-icon>
                <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #fff;font-size: 15.5px;position: absolute;top: 1px; left: 1px"></font-awesome-icon>
              </span>
            </div>
          </div>
          <mt-radio
            style="width:85%;display: inline-block;margin-left: 20px"
            align="right"
            v-model="aNote.label"
            :options="usableLabel"
            @change="labelChange()">
          </mt-radio>
            <div style="color:#0d8794;line-height: 24px;padding-left: 26px;margin-bottom: 12px" @click="addLabel" v-show="!addLabelIng">新建</div>
            <div v-show="usableLabel && usableLabel.length == 0">暂无标签</div>

            <div style="width: 84%; margin: 5px 17px;display: flex;justify-content: center;align-items: center;" v-show="addLabelIng">
                <span @click="cancelAddLabel"><font-awesome-icon :icon="['fas', 'times']" style="color: #333;font-size: 20px;"></font-awesome-icon></span>
                <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 15px;margin-left: 5px;" :style="{color:addLabelColor}"></font-awesome-icon>
                <input type="text" style="width: 70%" class="addInput" v-model="addLabelName">
                <span @click="commitAddLabel"><font-awesome-icon :icon="['fas', 'check']" style="color: #333;font-size: 20px;"></font-awesome-icon></span>
            </div>
            <div @click="closePopup" style="text-align: center;color:#0d8794;margin:12px 0 22px">取消</div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
//  import { Toast } from 'mint-ui';
import bus from '@/utils/bus'
import { noteUrl, loginUrl, changepasswordUrl } from "../config"
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
        },
          usableLabel(){
              return this.$store.getters.usableLabel;
          },
          deviceId(){
              return this.$store.state.device_id;
          },
          filterType(){
              return this.$store.state.filterType;
          },
        labelMap() {
          const obj = {}
          for (const label of this.usableLabel) {
            console.log(label.label)
            obj[label.value] = {color: label.color, name: label.label}
          }
          return obj
        },
        maxLabelId() {
          let id = 0
          for(const item of this.usableLabel) {
            if (item.value > id) {
              id = item.value
            }
          }
          return id
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
              collect:0,
              content:'',
              updateTime:(new Date()).valueOf(),
              status:1,
              islock:'0'
            },
            oldLabel:'',
            openType:'add',
            oldContent:'',
            contentEle:null
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
          this.aNote.collect = this.aNote.collect == 1 ? 0 : 1;
          this.aNote.updateTime = (new Date()).valueOf();
          this.updateNote()
        },
          toggleLock(){
              this.aNote.islock = this.aNote.islock == 1 ? 0 : 1;
              this.aNote.updateTime = (new Date()).valueOf();
              this.updateNote()
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
          // //查找颜色
          // for(var a = 0; a < this.labelArr.length; a++){
          //     if(this.labelArr[a].value == this.aNote.label){
          //         this.aNote.color = this.labelArr[a].color;
          //         this.aNote.labelName = this.labelArr[a].label;
          //         break
          //     }
          // }
          this.aNote.updateTime = (new Date()).valueOf();
          this.updateNote()
          // this.$store.commit('openUpdate');
          // this.$store.commit('setNoteArr', this.noteArr);
        },
        //打开新建标签
        addLabel(){
            this.addLabelIng = true;
            var colorIndex = this.labelArr.length%15==0?0:this.labelArr.length%15-1
            this.addLabelColor = this.colors[colorIndex];
        },
        //提交新建标签
        async commitAddLabel() {
          if (!this.addLabelName) {
            this.$toast({
              message: '标签名不能为空',
              position: 'bottom',
              duration: 3000,
              className: 'toast'
            });
            return
          }
          var isExist = false;
          for (var a = 0; a < this.usableLabel.length; a++) {
            if (this.usableLabel[a].label == this.addLabelName) {
              isExist = true;
              this.$toast({
                message: '标签名已存在',
                position: 'bottom',
                duration: 3000,
                className: 'toast'
              });
              break;
            }
          }
          if (isExist) {
            return
          }
          var newLabel = [{
            value: String(this.maxLabelId * 1 + 1),
            label: this.addLabelName,
            color: this.addLabelColor,
            status: 1,
            updateTime: (new Date()).valueOf(),
            device_id: this.deviceId
          }].concat(this.labelArr)
          await this.$.ajax({
            url: noteUrl + 'user/update',
            method: 'post',
            data: {
              label_arr: JSON.stringify(newLabel)
            }
          })
          bus.$emit('updateLabel')
          this.addLabelIng = false;
          this.addLabelName = '';
        },
        //取消新建
        cancelAddLabel(){
            this.addLabelIng = false;
            this.addLabelName = '';
        },
        textFocus(e){
            if(e && this.aNote.content !== e){
                this.title = '编辑笔记';
                this.aNote.content = e;
            }
        },
        textBlur(){
//            console.log('失焦');
//            this.title = '笔记'
        },
        async saveNote() {
          console.log('保存笔记')
          var editor = document.querySelector('.vue-html5-editor .content');
          this.aNote.content = editor.innerHTML;
          console.log(editor.innerText.trim())
          // 新建笔记 并且 输入内容为空
          if (this.openType === 'add' && (this.aNote.content.trim() === '' || (editor.innerText.trim() === '') && editor.innerHTML.trim() === '')) {
            return;
          }
          if (this.oldContent === this.aNote.content) {
            this.title = '笔记';
            return;
          }
          if (this.aNote.content === '') {
            this.removeNote();
          }
          this.aNote.time = (new Date()).valueOf();
          this.aNote.updateTime = (new Date()).valueOf();
          //判断note是否已经存在
          var isExist = false;
          if (this.aNote.id) {
            isExist = true
          }
          if (isExist) {
            // 更新笔记
            await this.$.ajax({
              url: noteUrl + 'note/update',
              method: 'post',
              data: {...this.aNote}
            })
          } else {
            if (this.filterType == 'lock') {
              this.aNote.islock = '1'
            }
            // 新建笔记
            const note = await this.$.ajax({
              url: noteUrl + 'note/add',
              method: 'post',
              data: this.aNote
            })
            if (note.code ===0) {
              this.aNote.id = note.data.id
            }
            console.log(note)
          }
          this.title = '笔记';
          this.oldContent = this.aNote.content
          bus.$emit('getCount')
          return Promise.resolve()
        },
        async back() {
          // if(this.title == '编辑笔记'){
          //     if(this.aNote.content == '' && !!this.oldContent){
          //         this.aNote.content = this.oldContent;
          //     }
          await this.saveNote();
          // }
          // this.$router.push({
          //   path: '/noteList'
          // });
          this.$router.go(-1)
        },
        //删除笔记
        removeNote(){
            if (!this.aNote.id) {
              return
            }
            this.$messageBox.confirm('确定要将该笔记放入回收站吗？<br>20天后将自动彻底删除').then(async action => {
              this.aNote.status = 0;
              this.aNote.updateTime = (new Date()).valueOf();
              const res = await this.$.ajax({
                url: noteUrl + 'note/delete',
                method: 'get',
                params: {
                  id: this.aNote.id,
                  status: 0
                }
              })
              this.$router.replace({path: '/noteList'});
              bus.$emit('update', {type: 'one', id: this.aNote.id, action: 'delete'})
            }).catch(action=>{
                return false;
            })
        },
        keepLastIndex(obj) {
            if (window.getSelection) {//ie11 10 9 ff safari
                obj.focus(); //解决ff不获取焦点无法定位问题
                var range = window.getSelection();//创建range
                range.selectAllChildren(obj);//range 选择obj下所有子内容
                range.collapseToEnd();//光标移至最后
            }
            else if (document.selection) {//ie10 9 8 7 6 5
                var range = document.selection.createRange();//创建选择对象
                //var range = document.body.createTextRange();
                range.moveToElementText(obj);//range定位到obj
                range.collapse(false);//光标移至最后
                range.select();
            }
        },
        ctrlS(event) {
            var that = this
            if(event.keyCode === 83 && event.ctrlKey){

                console.log('拦截到83+ctrl');//ctrl+s
                this.saveNote()
                event.preventDefault();

                event.returnValue = false;

                return false;

            } else if (event.ctrlKey && event.keyCode === 17) {
                console.log(event)
                event.preventDefault();

                event.returnValue = false;

                return false;
            }
        },
        async getNoteDetail(id) {
          if (!id) {
            return
          }
          const res = await this.$.ajax({
            url: noteUrl + 'note/detail',
            method: 'get',
            params: {
              id: id
            }
          })
          console.log(res)
          this.aNote = {
            ...res.data,
            label: String(res.data.label) || '0'
          }
          this.oldContent = this.aNote.content
        },
        async updateNote() {
          const res = await this.$.ajax({
            url: noteUrl + 'note/update',
            method: 'post',
            data: this.aNote
          })
        },
        initNote() {
          var editor = document.querySelector('.vue-html5-editor .content');
          editor.onfocus = ()=> {
            this.textFocus()
          }
          if(this.$route.query.id){
            //查找note
            this.openType = 'edit';
            console.log(this.$route.query.id)
            this.getNoteDetail(this.$route.query.id)
          }else {
            //新建node
            this.openType = 'add';
            this.aNote = {label:'0',
              time:(new Date()).valueOf(),
              collect:0,
              content:'',
              updateTime:(new Date()).valueOf(),
              status:1,
              islock:'0'
            }
            setTimeout(()=>{
              this.aNote.user_note_id = Date.now();
              this.aNote.device_id = this.deviceId;
              console.log(this.aNote)
            });
//          this.$refs.inputVal.focus()

            editor.focus();
            this.keepLastIndex(editor)
            console.log(editor);

          }
        }
      },
      activated() {
        this.initNote()
        if (window.history && window.history.pushState) {
          //监听返回
          window.removeEventListener('popstate', this.back, false);
          document.removeEventListener('keydown', this.ctrlS, false);
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.back, false);
          // ctrl+s保存
          document.addEventListener('keydown',this.ctrlS)
        }
      },
      deactivated() {
        this.aNote.content = ''
        if(this.openType === 'edit') {
          bus.$emit('update', {type: 'one', id: this.aNote.id})
        }else {
          bus.$emit('update', {type: 'all', id: null})
        }
        window.removeEventListener('popstate', this.back, false);
        document.removeEventListener('keydown', this.ctrlS, false);
      },
      mounted(){
        // this.initNote()
      },
      watch:{

      },
      destroyed(){
        window.removeEventListener('popstate', this.back, false);
        document.removeEventListener('keydown', this.ctrlS, false);
      }
  }
</script>

<style scoped>
  .vue-html5-editor{
    border: none;
    margin:0;
    outline:none;
    font-size: 16px;
    line-height: 24px;
    padding:0 5px;
    resize: none;
    /*width: calc(100% - 24px);*/
    width: 100%!important;
    height: calc(100% - 120px);
    overflow: auto;
    color:#464646
  }
  .vue-html5-editor>.content{
      padding-bottom: 26px!important;
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
    padding:15px 5px;
  }
  .detail-top{
    margin: 12px 0;
  }


</style>

<style>
    .vue-html5-editor>.content img{
        max-width: 100%!important;
    }
    .vue-html5-editor .dashboard>div>div{
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
    }
    .vue-html5-editor .dashboard>div>div>input{
        margin-right: 8px;
        max-width: 55%;
    }
    .vue-html5-editor .dashboard>div>div>button{
        margin-left: 8px;
    }
    .vue-html5-editor pre{
      width: 100%;
      white-space: pre-wrap!important;
      word-wrap: break-word!important;
    }
</style>
