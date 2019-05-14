<template>
  <div class="slidePage">
    {{msg}}
  </div>
</template>

<script>
  export default{
    name: 'slidePane',
    data () {
      return {
        msg: 'slidePane'
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
  }

</style>
