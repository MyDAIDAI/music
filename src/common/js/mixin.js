import {mapGetters} from 'vuex'
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  // keep-alive触发
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newlist) {
      this.handlePlaylist(newlist)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
