<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@/components/music-list/music-list'
  import {getSongList} from '@/api/recommend'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {createSong, isValidMusic} from 'common/js/song'

  export default {
    name: 'disc',
    components: {MusicList},
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data () {
      return {
        songs: []
      }
    },
    created () {
      this._getSongList()
    },
    methods: {
      _getSongList () {
        if (!this.disc.dissid) {
          this.$router.push('./recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">>
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to {
    -webkit-transform: translate3d(100%, 0, 0);
    -moz-transform: translate3d(100%, 0, 0);
    -ms-transform: translate3d(100%, 0, 0);
    -o-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
</style>
