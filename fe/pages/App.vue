<template>
  <div id="app" class="main-content">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    this.$rubik.init()
  }
}
</script>
<style lang="stylus">
@import '../style/common.styl'
</style>
