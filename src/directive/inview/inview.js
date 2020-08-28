import store from '@/store'
import isNotInView from '@/isNotInView'
var getPosition
var listBox
export default {
  inserted(el, binding, vnode) {
      getPosition = function() {
          // console.log(binding)
          console.log(!isNotInView(el))
          binding.value.inview = !isNotInView(el)
          // return binding;
      }
      // console.log(el)
      listBox = document.querySelector('.noteListBox');
      listBox.addEventListener('scroll', getPosition)
  },
  unbind() {
      listBox.removeEventListener('scroll', getPosition)
  }
}
