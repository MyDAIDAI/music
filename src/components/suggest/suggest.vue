<template>
  <scroll class="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <!--无结果提示-->
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {search} from 'api/search'
  import {normalizeSongs} from 'common/js/song'
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'

  const perpage = 20
  const TYPE_SINGER = 'singer'
  export default {
    name: 'suggest',
    components: {Scroll, Loading},
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        page: 1,
        result: [],
        pullup: true,
        beforeScroll: true,
        hasMore: true
      }
    },
    methods: {
      search () {
        this.page = 1
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        })
      },
      getIconClass (item) {
        if (item.type && item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type && item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        })
      },
      listScroll () {},
      selectItem (item) {
        if (item.type && item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
        //  TODO 歌曲设置播放
        }
        this.$emit('select', item)
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(normalizeSongs(data.song.list))
        }
        return ret
      },
      _checkMore (data) {
        const song = data.song
        if (!song.list.length || (song.curnum + (song.curpage - 1) * song.perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    watch: {
      query (newQuery) {
        if (!newQuery) {
          return
        }
        this.search(newQuery)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        .icon
          flex: 0 0 30px
          width: 30px
          [class^="icon-"]
            font-size: 14px
            color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
