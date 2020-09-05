<template>
    <div style="width: 100%;height: 100%">
        <iframe id="userIframe" :src="url" style="width: 100%; height:100%;border: none"></iframe>
    </div>
</template>
<script>
    import { loginUrl, changepasswordUrl } from "../config"
    export default{
        name:'user',
        computed:{
            url() {
                if (this.type === 'login') {
                    return loginUrl + '?from=webapp'
                } else if(this.type === 'changePassword') {
                    return changepasswordUrl + '?from=webapp'
                }
                return ''
            }
        },
        data(){
            return{
                type:'login',
                timmer: null,
                status: ''
            }
        },
        methods:{
            checkUser(){
                var obj=document.getElementById("userIframe").contentWindow;
                var ifmObj = obj.document.getElementById("status");
                if (ifmObj) {
                    this.status = ifmObj.innerText
                }
                if (this.status.indexOf('true') !== -1) {
                    this.$router.replace('/')
                    setTimeout(() => {
                        location.reload()
                    },100)
                }
            }
        },
        mounted(){
            if (this.$route.query.type) {
                this.type = this.$route.query.type
            }
            console.log(document.querySelector('#userIframe').getAttribute('src'))
            // setTimeout(() => {
            //     this.checkUser()
            // }, 2000)
            this.timmer = setInterval(this.checkUser, 500)
        },
        beforeDestroy() {
            if (this.timmer) {
                clearInterval(this.timmer)
            }
        }
    }
</script>

<style scoped>
    .main{
        width: 80%;
        /*padding:8px 40px;*/
        margin:44px auto;
        position: relative;
    }
    .line{
        width: 100%;
        height: 50px;
    }
    .line>span{
        display: inline-block;
        width: 80px;
        text-align: right;
    }
    input{
        border: none;
        outline: none;
        border-bottom: 1px solid #999;
        padding:5px;
        width: calc(100% - 120px);
        font-size: 16px;
        /*vertical-align: middle;*/
        background-color: rgba(255,255,255,0);
    }
    .switch{
        padding:5px 12px;
        position: absolute;
        right: 12px;
        top:8px;
        color: rgb(13, 135, 148);
    }
</style>