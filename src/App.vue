<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <m-header></m-header>
    <tab></tab>
    <!-- router-view的位置是有链接的内容的展示位置 -->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
export default {
  name: 'app',
  components: {
    MHeader,
    Tab
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
