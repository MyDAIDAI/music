<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <m-header></m-header>
    <tab></tab>
    <!-- router-view的位置是有链接的内容的展示位置 -->
    <keep-alive>
      <router-view></router-view>    
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'app',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
