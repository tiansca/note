<template>
    <div class="itemWrap" ref="itemWrap">
        <div class="noteItem" :style="{backgroundColor:note.rgbColor}"  :class="showCheck?'show-check-item':''" v-if="inview">
            <div class="note-title">
                <div class="note-title-line" v-html="note.content" v-if="showType==1"></div>
                <div v-if="showType==0" v-html="note.title"></div>
            </div>
            <div class="note-time">
                <span>{{note.time | formatDate}}</span>
                <span v-show="note.collect == 1"><font-awesome-icon :icon="['fas', 'star']" style="color: #fec000;font-size: 16px"></font-awesome-icon></span>
            </div>
        </div>
        <span class="item-checkbox" v-show="showCheck" v-if="inview">
            <font-awesome-icon :icon="['fas', 'check-square']" style="display:inline-block;width: 24px;height: 24px; color: #0d8794" v-if="note.check"></font-awesome-icon>
            <font-awesome-icon :icon="['fas', 'square']" :style="{color:(showType==1?'#fff':'rgba(225,225,225,0)')}" style="border-radius: 2px;border:1px solid #0d8794;display: inline-block;width: 20px;height: 20px" v-else></font-awesome-icon>
        </span>
    </div>
</template>

<script>
import isNotInView from '@/isNotInView'
export default {
    name: "listItem",
    props: {
        showType: {
            // type: Number,
            required: true
        },
        showCheck: {
            type: Boolean,
            required: true
        },
        note: {
            type: Object,
            required: true
        }
    },
    data() {
        return{
            inview: false,
            timer: null
        }
    },
    mounted() {
        // console.log(this.$refs)
        // console.log()
        this.$on('scroll', this.checkPosition)
        this.checkPosition()
    },
    beforeDestroy() {
        this.$off('scroll', this.checkPosition)
    },
    methods: {
        checkPosition() {
            if (!this.timer || Date.now() - this.timer > 100) {
                this.timer = Date.now()
                // console.log('滚动')
                this.inview = !isNotInView(this.$refs.itemWrap, 500)
            }
        }
    }
}
</script>

<style scoped>
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
</style>