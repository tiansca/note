import Vue from 'vue'
const broadcast = function(eName, value) {
  if (this && eName) {
    emitEvent(this, eName, value)
  }
}

const emitEvent = (vueObj, eName, value) => {
  if (vueObj && vueObj.$children && eName) {
    Object.values(vueObj.$children).forEach(item => {
      item.$emit(eName, value)
      emitEvent(item, eName, value)
    })
  }
}

export default {
  install() {
    if (!Vue.$broadcast) {
      Vue.$broadcast = broadcast
    }
    Vue.mixin({
      created() {
        this.$broadcast = Vue.$broadcast
      }
    })
  }
}
