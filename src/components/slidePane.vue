<template>
  <div class="slidePage">
    <div class="slidePage-head">
      笔记
    </div>
    <div class="slidePage-content">
      <div class="slidePage-group" @click="closeSlide">
        <div class="group-item clickItem" @click="changeFilterType('all')">
            <div class="groupItemBox">
                <img src="../assets/note.png" alt="">
                <span>全部笔记</span>
                <span class="group-item-num">{{usableNote.length}}</span>
            </div>
        </div>
        <div class="group-item clickItem" @click="changeFilterType('collect')">
            <div class="groupItemBox">
                <img src="../assets/star.png" alt="">
                <span>我的收藏</span>
                <span class="group-item-num">{{collectNote.length}}</span>
            </div>
        </div>
      </div>
      <div style="background: #fff;padding: 12px 18px;margin-bottom: -1px">
          <span style="color: #616161;font-size: 16px">标签</span>
          <span style="color: rgb(13, 135, 148);padding: 3px 5px;float: right;display: inline-block;margin-top: -4px;margin-right: -10px;" @click="goEdit" class="clickItem">编辑</span>
      </div>
      <div class="slidePage-group" @click="closeSlide">
        <div class="group-item clickItem" v-for="label in usableLabel" @click="changeFilterType(label.value)">
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
                <span>{{label.number}}</span>
            </div>

        </div>

      </div>
        <div style="background: #fff;padding: 12px 18px; margin-top:-14px">
            <span style="color: rgb(13, 135, 148);padding: 3px 5px;" class="clickItem" @click="addLabel">新建</span>
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
        },
        colors(){
            return this.$store.state.colors;
        },
    },
    data () {
      return {
        msg: 'slidePane',
          labelPopupVisible:false,
          addLabelColor:'#333',
          addLabelName:''
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
        commitAdd(){
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
            for(var a = 0; a < this.usableLabel.length; a++){
                if(this.usableLabel[a].label == this.addLabelName){
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
            this.labelPopupVisible = false;
            this.addLabelName = ''
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
      },
        labelArr:{
            handler(newVal, oldVal) {
                this.setLabelNum();
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

</style>
