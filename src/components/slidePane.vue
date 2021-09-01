<template>
  <div class="slidePage" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove" :style="{left:slideLeft + 'px'}" :class="{ transition: isTransition }">
    <div class="slidePage-head">
      <span @click="goLogin" v-if="!user">登录</span>
      <span v-if="user" @click="openInfo">{{user.name}}</span>
        <span class="logout" v-if="user" @click="logout">退出</span>
    </div>
    <div class="slidePage-content">
      <div class="slidePage-group" @click="closeSlide">
        <div class="group-item clickItem" @click="changeFilterType('all')">
            <div class="groupItemBox">
                <img src="../assets/note.png" alt="">
                <span>全部笔记</span>
                <span class="group-item-num">{{ countObj['all'] }}</span>
            </div>
        </div>
        <div class="group-item clickItem" @click="changeFilterType('like')">
            <div class="groupItemBox">
                <img src="../assets/star.png" alt="">
                <span>我的收藏</span>
                <span class="group-item-num">{{ countObj['like'] }}</span>
            </div>
        </div>
          <div class="group-item clickItem" @click="changeFilterType('lock',$event)" v-if="user">
              <div class="groupItemBox">
                  <img src="../assets/lock.png" alt="" style="width: 18px;margin: 2px;">
                  <span>我的加密</span>
                  <span></span>
                  <i style="float:right;padding: 3px 8px;margin-right: -10px;margin-top: -3px;" class="clickItem" @click="openResetSafe()" stop="true">
                      <font-awesome-icon :icon="['fas', 'edit']" style="color: #999;font-size: 18px" stop="true"></font-awesome-icon>
                  </i>

              </div>
          </div>
      </div>
      <div style="background: #fff;padding: 12px 18px;margin-bottom: -1px">
          <span style="color: #616161;font-size: 16px">标签</span>
          <span style="color: rgb(13, 135, 148);padding: 3px 5px;float: right;display: inline-block;margin-top: -4px;margin-right: -10px;" @click="goEdit" class="clickItem">编辑</span>
      </div>
      <div class="slidePage-group" @click="closeSlide">
        <div class="group-item clickItem" v-for="label in usableLabel" @click="changeFilterType(`tag_${label.value}`)">
            <div class="groupItemBox">
                <span  v-if="label.value == 0" style="display: inline-block;width: 18px;height: 18px">
            <span style="font-size: 18px;position: relative">
            <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #333;font-size: 18px;position: absolute;top: 0;left: 0"></font-awesome-icon>
            <font-awesome-icon :icon="['fas', 'bookmark']" style="color: #fff;font-size: 15.5px;position: absolute;top: 1px; left: 1px"></font-awesome-icon>
          </span>
          </span>
                <span v-if="label.value !=0" class="label-icon">
            <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 18px" :style="{color:label.color}"></font-awesome-icon>
          </span>

                <span class="labelName">{{label.label}}</span>
                <span>{{ countObj[label.value] || 0 }}</span>
            </div>

        </div>

      </div>
        <div style="background: #fff;padding: 12px 18px; margin-top:-14px">
            <span style="color: rgb(13, 135, 148);padding: 3px 5px;" class="clickItem" @click="addLabel">新建</span>
        </div>

        <div class="slidePage-group" @click="closeSlide" style="margin-top: 14px;">
            <div class="group-item clickItem" @click="changeFilterType('delete')">
                <div class="groupItemBox">
                    <img src="../assets/recycle.png" alt="">
                    <span>回收站</span>
                    <span class="group-item-num">{{ countObj['delete'] }}</span>
                </div>
            </div>
        </div>

        <div class="slidePage-group" @click="closeSlide" style="margin-top: 14px">
            <div class="group-item clickItem" @click="feedback()">
                <div class="groupItemBox">
                    <img src="../assets/feedback.png" style="width: 18px; margin: 2px" alt="">
                    <span>反馈</span>
                    <span class="group-item-num"></span>
                </div>
            </div>
        </div>

        <div class="slidePage-group" @click="closeSlide" style="margin-top: 14px">
            <div class="group-item clickItem" @click="checkVersion(true)">
                <div class="groupItemBox">
                    <img src="../assets/version.png" style="width: 20px; margin: 1px" alt="">
                    <span>检查更新 {{version}}</span>
                    <span class="group-item-num"></span>
                </div>
            </div>
        </div>
    </div>

      <!--标签弹窗-->
      <mt-popup
          style="width: 100%"
          v-model="labelPopupVisible"
          position="bottom"
          modal="true"
          :closeOnClickModal="false">
          <div style="width: 100%;padding:12px 20px">
              <h3 style="text-align: left">新建标签</h3>
              <div style="width: calc(100% - 40px)">
                  <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 20px;margin-left: 5px;" :style="{color:addLabelColor}"></font-awesome-icon>
                  <input class="addInput" type="text"  v-model="addLabelName">
              </div>
              <div class="popupButton">
                  <div><span class="clickItem" @click="cancelAdd">取消</span></div>
                  <div><span class="clickItem" :style="{color:addLabelName==''?'#777':'#333'}" @click="commitAdd">确定</span></div>
              </div>
          </div>
      </mt-popup>

      <!--   下载新版本   -->
      <iframe
          style="display:none"
          v-bind:src="downloadLink"
      ></iframe>
  </div>
</template>

<script>
    import thisVersion from '../version.js';
    import Clipboard from 'clipboard';
    import { noteUrl, versionUrl, loginUrl, changepasswordUrl } from "../config"
    import bus from '@/utils/bus'
  export default{
    name: 'slidePane',
    computed:{
        usableNote(){
            return this.$store.getters.usableNote;
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
        labelArr(){
            return this.$store.state.labelArr;
        },
        usableLabel(){
            return this.$store.getters.usableLabel;
        },
        colors(){
            return this.$store.state.colors;
        },
        user(){
            return this.$store.state.user
        },
        noteArr(){
            return this.$store.state.noteArr;
        },
        update(){
            return this.$store.state.update;
        },
        deviceId(){
            return this.$store.state.device_id;
        },
        filterType(){
            return this.$store.state.filterType;
        },
        countObj() {
          const obj = {}
          for (const item of this.countData) {
            console.log(item)
            obj[item.label] = item.value
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
    data () {
      return {
          msg: 'slidePane',
          labelPopupVisible:false,
          addLabelColor:'#333',
		  slideLeft:0,
          touchStartX:0,
          isTransition:false,
          slideWidth:0,
          touchTimeStamp:0,
		      version:thisVersion.version,
          hasNewVersion:false,
          latestVersion:'',
          addLabelName:'',
          isScroll:false,
          downloadLink:'',
          countData: [],
          safepassword: ''
      }
    },
    methods:{
      closeSlide(){
          this.$store.commit('setGlobalBg',1);
          setTimeout(()=>{
              this.$store.commit('setSlide');

          },100)
      },
      changeFilterType(n,e){
//          console.log(e)
          if(e && e.target && (e.target.localName == 'svg' || e.target.localName == 'i' || e.target.localName == 'path')){
              return
          }
          if(this.filterType == n){
              return
          }
          if(n == 'lock' && this.user){
              this.openLock();
              return;
          }
        this.$store.commit('setFilterType',n)
      },
      async openLock() {
        const res = await this.$.ajax({
          url: noteUrl + 'user/password'
        })
        console.log(res)
        this.safepassword = res.data
        if (sessionStorage.getItem('safe_password') === this.safepassword && this.safepassword !== '') {
          //cookie有加密密码，直接打开
          this.$store.commit('setFilterType', 'lock');
        } else {
          //判断当前用户有无加密密码，若无设置，若有则输入验证
          if (this.safepassword) {
            this.$messageBox.prompt('请输入隐私密码').then(({value, action}) => {
              if (value == this.safepassword) {
                this.$store.commit('setFilterType', 'lock');
                sessionStorage.setItem('safe_password', value)
              } else {
                this.$messageBox({
                  title: '提示',
                  message: '隐私密码错误',
                  showCancelButton: false
                });
              }
            }).catch(action => {
              return false;
            });
          } else {
            this.$messageBox.prompt('请设置隐私密码（用来访问加密笔记，并非登录密码）').then(({value, action}) => {
              console.log(value, action);
              if (value) {
                this.$.ajax({
                  method: "POST",
                  url: noteUrl + 'user/update',
                  data: {
                    safe_password: value
                  }
                }).then((res) => {
                  if (res.code == 0) {
                    this.safepassword = value
                    sessionStorage.setItem('safe_password', value)
                  }
                })
              } else {
                this.$messageBox({
                  title: '提示',
                  message: '隐私密码不能设置为空',
                  showCancelButton: false
                });
              }

            }).catch(action => {
              return false;
            });
          }
        }
      },
      setLabelNum(){
        // for(let a = 0; a < this.usableLabel.length; a++){
        //   let fund = false
        //   for (let b = 0; b < this.countData.length; b++){
        //     if (this.updateLabel[a].id === this.countData[b].name) {
        //       this.$set(this.usableLabel[a], 'number', this.countData[b].value)
        //       fund = true
        //     }
        //   }
        //   if (!fund) {
        //     this.usableLabel[a].number = 0
        //   }
        // }
      },
        goEdit(){
          this.closeSlide();
          setTimeout(()=> {
              this.$router.push('/editLabel')
          },300)
        },
        addLabel(){
          this.labelPopupVisible = true;
            var colorIndex = this.labelArr.length%15==0?0:this.labelArr.length%15-1
            this.addLabelColor = this.colors[colorIndex];
        },
        cancelAdd(){
          this.labelPopupVisible = false;
          this.addLabelName = ''
        },
        async commitAdd() {
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
          this.downloadLabel()
          this.labelPopupVisible = false;
          this.addLabelName = ''
        },
        goLogin(){
            this.closeSlide();
            // 开发环境自动登录
            // this.$.ajax({
            //     method:"POST",
            //     url:'login',
            //     data: {
            //         password: "tianSHI0402",
            //         username: "tiansc"
            //     }
            // }).then((res)=>{
            //
            // }).catch(e => {
            //     // this.$indicator.close()
            // })
            setTimeout(()=> {
                // location.href = loginUrl + '?from=' + location.href
                this.$router.push({
                    path: '/user',
                    query: {
                        type: 'login'
                    }
                })
            },300)
        },
        logout(){
            localStorage.setItem('oldUser', JSON.stringify(this.user));
            this.$store.commit('removeUserSession')
            this.$indicator.open()
            this.$.ajax({
                method:"GET",
                url:'logout'
            }).then((res)=>{
                location.reload()
                this.$indicator.close()
            }).catch(e => {
                this.$indicator.close()
            })
        },
        updateNote(first){
            var noteCount = 0;
            for(let a = 0; a < this.noteArr.length; a++){
                this.$.ajax({
                    method:"POST",
                    url:noteUrl + 'updateNote.php',
                    data:this.qs({
                        user_note_id:this.noteArr[a].user_note_id,
                        user_id:this.user.id,
                        label:this.noteArr[a].label,
                        collect:this.noteArr[a].collect,
                        time:this.noteArr[a].time,
                        updateTime:this.noteArr[a].updateTime,
                        content:this.noteArr[a].content,
                        status:this.noteArr[a].status,
                        device_id:this.noteArr[a].device_id,
                        islock:this.noteArr[a].islock
                    })
                }).then((res)=>{
                    if(res.code == 0){
                        noteCount++
                        if(noteCount == this.noteArr.length && first){
                            this.downloadNote()
                        }
                    }
                })
            }
        },
        downloadNote(){
            console.log('下载')
            this.$.ajax({
                method:"get",
                url: noteUrl + 'note/list'
                // data:{
                //
                // }
            }).then((res)=>{
                if(res.code == 0){
                    // console.log('设置笔记2', res.data)
                    this.$store.commit('setNoteArr', res.data)
                }
            })
        },
        updateLabel(){
            this.$.ajax({
                method:"POST",
                url:noteUrl + 'updateLabel.php',
                data:this.qs({
                    labelArr:JSON.stringify(this.labelArr),
                    user_id:this.user.id
                })
            }).then((res)=>{
                console.log(res);
            })
        },
        downloadLabel(){
            this.$.ajax({
                method:"get",
                url:noteUrl + 'user/label'
            }).then((res)=>{
                if(res.code == 0){
                    if(res.data && res.data != 'null'){
                        var newLabel = res.data;
                        console.log(newLabel)
                        this.$store.commit('setLabelArr', newLabel);
                    }
                    // 设置隐私密码
                    // if(res.data && res.data !== 'null' && res.data.safe_password) {
                    //     this.$store.commit('setSafePassword', res.data.safe_password);
                    // } else {
                    //     this.$store.commit('setSafePassword', '');
                    // }
                }
            })
        },
        getCookie(name){
            var nameEQ = name + '='
            var ca = document.cookie.split(';') // 把cookie分割成组
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i] // 取得字符串
                while (c.charAt(0) == ' ') { // 判断一下字符串有没有前导空格
                    c = c.substring(1, c.length) // 有的话，从第二位开始取
                }
                if (c.indexOf(nameEQ) == 0) { // 如果含有我们要的name
                    return unescape(c.substring(nameEQ.length, c.length)) // 解码并截取我们要值
                }
            }
            return false
        },
        clearCookie(name){
            this.setCookie(name, "", -1);
        },
        setCookie(name, value, seconds){
            seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
            var expires = "";
            if (seconds != 0 ) {      //设置cookie生存时间
                var date = new Date();
                date.setTime(date.getTime()+(seconds*1000));
                expires = "; expires="+date.toGMTString();
            }
            document.cookie = name+"="+escape(value)+expires+"; path=/";   //转码并赋值
        },
        openResetSafe(){
            console.log('重置安全密码');
            this.$messageBox.confirm('确定要重置隐私密码吗？').then(action => {
                this.$store.commit('setLoading',true);
                var baseUrl = 'http://47.95.5.207/note/reset_safe.html'
                this.$.ajax({
                    method: 'post',
                    url: 'mail',
                    data: this.qs({
                        to:this.user.email,
                        subject:'重置密码',
                        content:"<span>请点击下面链接重置隐私密码，如果不能跳转，请复制网址到浏览器打开。</span><br>" +
                        "<a href=" + baseUrl + "?id=" + this.user.id  + ">" + baseUrl + "?id=" + this.user.id + "<a/>"
                    })
                }).then((res=>{
                    this.$store.commit('setLoading',false);
                    if(res.data.return == 0){
                        this.$toast({
                            message: '重置链接以发送至邮箱，请查收！',
                            duration: 3000
                        });
                    }else {
                        this.$toast({
                            message: '邮件发送失败！',
                            position: 'top',
                            duration: 3000
                        });
                    }
                }));
            }).catch(action=>{
                return false;
            })
        },
        feedback(){
            this.$messageBox({
                title: '提示',
                message: '请发送至邮箱：<a href="mailto:tian_shicong@163.com" style="color:rgb(13, 135, 148)">tian_shicong@163.com</a>',
                showCancelButton: false
            });
        },
        checkVersion(isClick){
            console.log(this.version);
            this.$.ajax({
                method:"GET",
                url: versionUrl + 'latest',
                params: {
                  app_name: 'note',
                  platform: 'android'
                }
            }).then((res)=>{
                console.log(res);
                if(res.code === 0){
                    this.latestVersion = res.data;
                    if (this.latestVersion.version !== this.version) {
                        console.log(this.latestVersion.version);
                        const btnCopy = new Clipboard('.copybtn');
                        this.hasNewVersion = true;
                        this.$messageBox.confirm('发现新版本, 确定要下载吗？<br><span style="color: rgb(13, 135, 148)" class="copybtn clickItem" data-clipboard-action="copy" data-clipboard-text=' + this.latestVersion.link + '>复制链接</span>').then(action => {
                          if(this.downloadLink){
                            this.downloadLink = ''
                          }
                          setTimeout(()=>{
                            this.downloadLink = this.latestVersion.link;
                          },100)
                        }).catch(action=>{
                          return false;
                        })

                    } else if (isClick) {
                      if(isClick){
                        this.$toast({
                          message: '已经是最新版本了',
                          duration: 3000
                        });
                      }
                    }
                }
            })
        },
        refresh(){
            this.$store.commit('refresh')
        },
 		touchstart(e){
//            console.log(e);
//            console.log(e.touches[0].pageX);
            this.touchTimeStamp = e.timeStamp;
            this.touchStartX = e.touches[0].pageX;
            this.isScroll = false;
        },
        touchmove(e){
//            console.log(e);
//            console.log(e.touches[0].pageX);
//            console.log(this.touchStartX - e.touches[0].pageX);
            if(this.isScroll){
                this.slideLeft = 0;
                return
            }
            this.slideLeft = (e.touches[0].pageX - this.touchStartX) < 0 ? e.touches[0].pageX - this.touchStartX : 0
        },
        touchend(e){
//            console.log(e);
            console.log(-this.slideLeft / (e.timeStamp - this.touchTimeStamp));
            var speed = -this.slideLeft / (e.timeStamp - this.touchTimeStamp);
            if((-this.slideLeft > this.slideWidth*0.4) || speed > 0.3){
                this.$store.commit('setGlobalBg');
                this.$store.commit('setSlide');
                setTimeout(()=>{
                    this.slideLeft = 0
                },350)
            }else{
                this.slideLeft = 0;
                this.isTransition = true;
                setTimeout(()=>{
                    this.isTransition = false;
                },300);
            }
        },
        openInfo() {
            this.closeSlide();
            this.$messageBox({
                title: '用户信息',
                message: '用户名：' + this.user.name + ' <br> ' + '邮箱：' + this.user.email,
                showCancelButton: true,
                confirmButtonText:'退出登录',
                cancelButtonText:'修改密码'
            }).then(action => {
                console.log(action);
                if(action == 'confirm'){
                    this.logout()
                }else {
                    this.$router.push({
                        path: '/user',
                        query: {
                            type: 'changePassword'
                        }
                    })
                }

            }).catch((action)=>{
                console.log(action)
            })
        },
        getCount() {
          this.$.ajax({
            method:"get",
            url:noteUrl + 'note/count'
          }).then((res)=>{
            if (res.code === 0) {
              this.countData = res.data
            }
          })
        }
    },
    mounted(){
      this.checkVersion()
      bus.$off('getCount', this.getCount)
      bus.$on('getCount', this.getCount)
      bus.$off('updateLabel', this.downloadLabel)
      bus.$on('updateLabel', this.downloadLabel)
        var timer = setInterval(()=> {
            if(this.user && this.user.name){
                clearInterval(timer);
                clearTimeout(timer1);
                // 获取标签列表
                this.downloadLabel()

                //获取count
                this.getCount()
                // 获取note列表
                // this.downloadNote()
            }
        },200);
        setTimeout(()=>{
          this.setLabelNum();
        },10);
        var timer1 = setTimeout(()=>{
            clearInterval(timer)
        },5000);
		// this.checkVersion()

        //获取侧栏宽度
        setTimeout(()=>{
            var slide = document.querySelector('#app');
            this.slideWidth = Math.ceil(slide.clientWidth * 0.7);
            console.log(this.slideWidth);

        //    监听侧栏滚动
            var slideBox = document.querySelector('.slidePage-content');
//            console.log(listBox)
            slideBox.onscroll = ()=>{
                console.log('滚动');
                this.isScroll = true;
            }
        },200)

    },
    watch:{
      usableNote: {
        handler(newVal, oldVal) {
            // this.setLabelNum();
        },
        deep: true
      },
        labelArr:{
            handler(newVal, oldVal) {
                // this.setLabelNum();
                // if(this.user && this.user.name && this.labelArr.length > 1){
                //     // this.updateLabel();
                // }
            },
            deep: true
        },
        update(){
          if(this.update){
              console.log('同步')
              if(this.user && this.user.name){
                  console.log('开始同步')
                  this.updateNote();
              }
              setTimeout(()=>{
                  this.$store.commit('closeUpdate')
              },500)
          }
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
    background-color: #efefef;
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
    padding:0 18px;
  }
  .group-item>div>img{
    width: 22px;
    vertical-align: middle;
    margin-top: -1px;
  }
  .group-item>div>span{
    vertical-align: middle;
    font-size: 16px;
    margin-left: 5px;
  }
  .group-item>div>span:last-of-type{
    float: right;
    margin-top: 3px;
  }

  .group-item-num{
    color:#666
  }
  .label-icon{
    position: relative;
    top: 1px;
    display: inline-block;
    margin-right: 3px;
  }
    .popupButton{
        padding: 28px 0;
        height: 40px;
        width: calc(100% - 40px);
    }
    .popupButton>div{
        float: left;
        width: 50%;
        text-align: center;
    }
  .popupButton>div:first-child{
      float: left;
      width: calc(50% - 1px);
      text-align: center;
      border-right: 1px solid #999;
  }
  .popupButton>div>span{
      padding: 8px 40px;
  }

  .addInput{
        border: none;
        border-bottom: 1px solid #999;
        outline: none;
        font-size: 16px;
        line-height: 24px;
        padding: 5px;
        margin-left: 14px;
        width: calc(100% - 50px)
    }
    .groupItemBox{
        width: 100%;
        margin: 0px auto;
        border-bottom: 0.5px solid rgb(202, 202, 202);
        padding: 12px 0;
    }
  .group-item:last-of-type>.groupItemBox{
      border-bottom: none;
  }
    .logout{
        color:rgb(13, 135, 148);
        float: right;
        font-size: 16px;
    }
    .transition{
        transition: left 0.3s;
    }

</style>
