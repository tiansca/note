<template>
    <div>
        <div class="head">
        <span class="left" @click="goBack">
            <font-awesome-icon :icon="['fas', 'times']" style="color:#333" :style="{}"></font-awesome-icon>
        </span>
            <span class="title">编辑标签</span>
            <span  class="right" @click="saveLabel"><font-awesome-icon :icon="['fas', 'check']" style=""></font-awesome-icon></span>
        </div>
        <div class="content">
            <div class="group-item clickItem" v-for="label in labelList"   v-if="label.value !=0 && label.status==1">
                <div class="groupItemBox">
                    <span class="label-icon">
            <font-awesome-icon :icon="['fas', 'bookmark']" style="font-size: 18px" :style="{color:label.color}"></font-awesome-icon>
          </span>
                    <input class="addInput clickItem" v-model="label.label">
                    <span style="padding: 0 8px;font-size: 18px;" @click="removeLabel(label)"><font-awesome-icon :icon="['fas', 'times']" style="color:#333" :style="{}"></font-awesome-icon></span>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "editLabel",
        computed:{
            labelArr(){
                return this.$store.state.labelArr;
            },
            usableLabel(){
                return this.$store.getters.usableLabel;
            },
        },
        data(){
            return{
                oldLabelArr:[],
				labelList:[]
            }
        },
        methods:{
            goBack(){
                this.$router.replace('/noteList');
            },
            saveLabel(){
				console.log('保存')
                for(var a = 0; a < this.labelList.length; a++){
                    for(var b = 0; b < this.labelArr.length; b++){
                        if(this.labelList[a].value == this.labelArr[b].value){
                            this.labelArr[b] = this.labelList[a];
                        }
                    }
                }
				this.$store.commit('setLabelArr', JSON.parse(JSON.stringify(this.labelArr)));
				this.$forceUpdate();
				this.$router.replace('/noteList');
            },
			removeLabel(label){
				label.status = 0;
			}
        },
        mounted() {
            setTimeout(()=>{
                this.oldLabelArr = JSON.parse(JSON.stringify(this.usableLabel));
				this.labelList = JSON.parse(JSON.stringify(this.usableLabel));
            })
        }
    }
</script>

<style scoped>
    .head{
        font-size: 20px;
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 40px;
        background: #f8f8f8;
        color: #333;
        line-height: 40px;
    }
    .left{
        font-size: 22px;
        display: inline-block;
        margin: 0 5px 0 5%;
        vertical-align: middle;
    }
    .right{
        float: right;
        margin-right: 5%;
    }
    .content{
        width: 100%;
        height: calc(100% - 40px);
        position: fixed;
        top: 40px;
        left: 0;
        overflow: auto;
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
    .groupItemBox{
        width: 100%;
        margin: 0px auto;
        border-bottom: 0.5px solid rgb(202, 202, 202);
        padding: 12px 0;
    }
    .group-item:last-of-type>.groupItemBox{
        border-bottom: none;
    }
    .addInput{
        border: none;
        outline:none;
        font-size: 16px;
        padding: 5px;
        vertical-align: middle;
    }
</style>
