export default {
  inserted(el, binding) {
  console.log(el)
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap') || el.querySelector('.el-scrollbar .el-autocomplete-suggestion__wrap') || el.querySelector('.my_option_box .options-wrap') || el// 获取element-ui scroll 下拉 box 可用于select或者autocomplete组件
    SELECTWRAP_DOM.addEventListener('scroll', function() {
      /**
                    * scrollHeight 内容总高度 即显示的高度+未显示select-item高度
                    * scrollTop 已经滑动高度
                    * clientHeight 读取元素的可见高度 盒子的实际高度 不变
                    * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                    * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                    */
      const condition = this.scrollHeight - this.scrollTop <= this.clientHeight + 10
      if (condition) {
        binding.value()
      }
    })
  }
}
