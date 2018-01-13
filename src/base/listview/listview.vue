<template>
  <scroll :data="data" 
          class="listview" 
          ref="listview" 
          @scroll="scroll" 
          :listenScroll="listenScroll" 
          :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li class="item" 
            v-for="(item, index) in shortcutList" 
            @touchstart.stop.prevent="onShortcutListTouchStart" 
            @touchmove.stop.prevent="onShortcutListTouchMove"
            :data-index="index" 
            :key="index"
            :class="{'current': currentIndex === index}">{{item}}</li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  const ANCHOR_HEIGHT = 18

  export default {
    name: 'listview',
    components: {
      Scroll
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        currentIndex: 0,
        scrollY: -1
      }
    },
    created () {
      this.touch = {}
      this.probeType = 3
      this.listenScroll = true
      this.listHeight = []
    },
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      }
    },
    methods: {
      onShortcutListTouchStart (e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this.currentIndex = parseInt(anchorIndex)
        this._scrollTo(anchorIndex)
      },
      onShortcutListTouchMove (e) {
        // 不能够使用获取Index直接跳转的方式，它只会获取第一次点击的index值，所以只能根据坐标位置的变化计算
        // 原因：https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let disData = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + disData
        this.currentIndex = parseInt(anchorIndex)
        this._scrollTo(anchorIndex)
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      _caculateHeight () {
        this.listHeight = []
        let height = 0
        this.listHeight.push(height)
        let list = this.$refs.listGroup
        for (let i = 0; i < list.length; i++) {
          let itemHight = list[i].clientHeight
          height += itemHight
          this.listHeight.push(height)
        }
      },
      _scrollTo (index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index])
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._caculateHeight()
        }, 20)
      },
      scrollY (newY) {
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        let listHeight = this.listHeight
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (!height2 || (-newY >= height1 && -newY < height2)) {
            this.currentIndex = i
            return
          }
        }
        this.currentIndex = 0
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>