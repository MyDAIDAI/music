const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

function noop () {}

export default class Lyric {
  constructor (lrc, handler = noop) {
    this.lrc = lrc
    this.tags = {}
    this.lines = []
    this.handler = handler
    this.state = STATE_PAUSE
    this.curLine = 0
    console.log(this.lrc)
    this._init()
  }
  _init () {
    this._initTag()
    this._initLines()
  }
  // 初始化附加信息
  _initTag () {
    for (let tag in tagRegMap) {
      const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
      this.tags[tag] = (matches && matches[1]) || ''
    }
  }

  /**
   * 获取以毫秒为单位的时间以及相应歌词对象
   * @private
   */
  _initLines () {
    const lines = this.lrc.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let result = timeExp.exec(line)
      if (result) {
        const txt = line.replace(timeExp, '').trim()
        if (txt) {
          this.lines.push({
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
            txt
          })
        }
      }
    }
    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }
  // 根据时间寻找对应歌词
  _findCurNum (time) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }
  // 执行回调函数
  _callHandler (i) {
    if (i < 0) {
      return
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }
  // 使用定时器来执行循环
  _playRest () {
    let line = this.lines[this.curNum]
    // 间隔时间即为下一句歌词到上一句歌词之间的时间
    let delay = line.time - (+new Date() - this.startStamp)
    this.timer = setTimeout(() => {
      // 将当前播放歌词以及行数放入到回调函数中
      this._callHandler(this.curNum++)
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay)
  }
  // +new Date() 将格林威治时间转换为时间戳
  play (startTime = 0, skipLast) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING
    this.curNum = this._findCurNum(startTime)
    this.startStamp = +new Date() - startTime
    if (!skipLast) {
      this._callHandler(this.curNum - 1)
    }

    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer)
      this._playRest()
    }
  }

  togglePlay () {
    let now = +new Date()
    if (this.state === STATE_PLAYING) {
      this.stop()
      this.pauseStamp = now // 记录暂停时间戳
    } else {
      this.state = STATE_PLAYING
      this.play((this.pauseStamp || now - this.startStamp || now), true) // 从暂停时间戳的地方开始播放
      this.pauseStamp = 0
    }
  }

  stop () {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }
  // 从偏移时间处开始播放
  seek (offset) {
    this.play(offset)
  }
}
