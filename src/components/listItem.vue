<template>
    <div class="itemWrap" ref="itemWrap">
        <div class="noteItem" :style="{backgroundColor: hexToRgb(labelColorMap[note.label])}"  :class="showCheck?'show-check-item':''" v-if="inview">
            <div class="note-title">
                <div class="note-title-line" v-html="note.content" v-if="showType==1"></div>
                <div v-if="showType==0" v-html="note.content"></div>
            </div>
            <div class="note-time">
                <span>{{note.updateTime | formatDate}}</span>
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
    computed: {
      usableLabel(){
        return this.$store.getters.usableLabel;
      },
      labelColorMap() {
        const obj = {}
        for (const label of this.usableLabel) {
          obj[label.value] = label.color
        }
        return obj
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
        },
      hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
          return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, 0.1)`
        }
        return '#fff'
      },
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