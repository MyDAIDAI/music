<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {createSong, isValidMusic} from 'common/js/song'

  export default {
    name: 'top-list',
    components: {MusicList},
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      }
    },
    created () {
      this._getMusicList()
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push({
            path: '/rank'
          })
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let musicData = item.data
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
