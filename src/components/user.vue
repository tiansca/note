<template>
    <div>
    </div>
</template>
<script>
    import { loginUrl, changepasswordUrl } from "../config"
    export default{
        name:'user',
        computed:{
            url() {
                if (this.type === 'login') {
                    return loginUrl + '?from=' + location.origin + (location.pathname?location.pathname:'')
                } else if(this.type === 'changePassword') {
                    return changepasswordUrl + '?from=' + location.origin + (location.pathname?location.pathname:'')
                }
                return ''
            }
        },
        data(){
            return{
                type:'login'
            }
        },
        methods:{

        },
        mounted(){
            if (this.$route.query.type) {
                this.type = this.$route.query.type
            }
            setTimeout(() => {
                location.replace(this.url)
            }, 100)
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