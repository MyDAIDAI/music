<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'
const transform = prefixStyle('transform')
const ProgressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initial = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initial) {
        return
      }
      let deltaX = e.touches[0].pageX - this.touch.startX
      let offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initial = false
      this.triggerPercent()
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offset = e.pageX - rect.left
      // 当点击progressBtn的时候，其e.offsetX获取不对
      this._offset(offset)
      this.triggerPercent()
    },
    triggerPercent () {
      let barWidth = this.$refs.progressBar.clientWidth - ProgressBtnWidth
      let percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initial) {
        let barWidth = this.$refs.progressBar.clientWidth - ProgressBtnWidth
        let offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
