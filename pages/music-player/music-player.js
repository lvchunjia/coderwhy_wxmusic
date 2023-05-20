// pages/music-player/music-player.js
import playerStore, {
  audioContext
} from "../../store/playerStore"
import {
  throttle
} from 'underscore'

const app = getApp()
const modeNames = ["order", "repeat", "random"]

Page({
  data: {
    stateKeys: ["id", "currentSong", "durationTime", "currentTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying", "playModeIndex"],

    // 播放歌曲id
    id: 0,
    // 当前播放歌曲
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    // 歌词
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,
    isPlaying: true,
    // 播放列表
    playSongList: [],
    // 正在播放歌曲index
    playSongIndex: 0,
    // 播放模式
    playModeName: "order",
    // 轮播导航
    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,
    // 内容-轮播高度
    contentHeight: 0,
    // 滑块进度
    sliderValue: 0,
    // 滑块是否在拖动
    isSliderChanging: false,
    isWaiting: false,
    // 歌词竖向滚动位置
    lyricScrollTop: 0
  },

  /**
   * 导航返回事件
   */
  onNavBackTap() {
    wx.navigateBack()
  },

  /**
   * 导航切换事件
   */
  onNavTabItemTap(event) {
    const index = event.currentTarget.dataset.index
    this.setData({
      currentPage: index
    })
  },

  /**
   * 轮播切换监听
   */
  onSwiperChange(event) {
    this.setData({
      currentPage: event.detail.current
    })
  },

  /**
   * 滑块进度点击监听
   */
  onSliderChange(event) {
    this.data.isWaiting = true
    setTimeout(() => {
      this.data.isWaiting = false
    }, 1500)
    // 1.获取点击滑块位置对应的value
    const value = event.detail.value

    // 2.计算出要播放的位置时间
    const currentTime = value / 100 * this.data.durationTime

    // 3.设置播放器, 播放计算出的时间
    audioContext.seek(currentTime / 1000)
    this.setData({
      currentTime,
      isSliderChanging: false,
      sliderValue: value
    })
  },

  /**
   * 滑块进度拖动过程监听
   */
  onSliderChanging: throttle(function (event) {
    // 1.获取滑动到的位置的value
    const value = event.detail.value
    // 2.根据当前的值, 计算出对应的时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({
      currentTime
    })
    // 3.当前正在滑动
    this.data.isSliderChanging = true
  }, 100),

  /**
   * 更新滑块进度
   */
  updateProgress: throttle(function (currentTime) {
    if (this.data.isSliderChanging) return
    // 1.记录当前的时间 2.修改sliderValue
    const sliderValue = currentTime / this.data.durationTime * 100
    this.setData({
      currentTime,
      sliderValue
    })
  }, 800, {
    leading: false,
    trailing: false
  }),

  /**
   * 切换播放模式
   */
  onModeBtnTap() {
    playerStore.dispatch("changePlayModeAction")
  },

  /**
   * 播放/暂停
   */
  onPlayOrPauseTap() {
    playerStore.dispatch("changeMusicStatusAction")
  },

  /**
   * 上一首
   */
  onPrevBtnTap() {
    playerStore.dispatch("playNewMusicAction", false)
  },

  /**
   * 下一首
   */
  onNextBtnTap() {
    playerStore.dispatch("playNewMusicAction")
  },

  getPlayerInfosHandler({
    id,
    currentSong,
    durationTime,
    currentTime,
    lyricInfos,
    currentLyricText,
    currentLyricIndex,
    isPlaying,
    playModeIndex
  }) {
    if (id !== undefined) {
      this.setData({
        id
      })
    }
    if (currentSong) {
      this.setData({
        currentSong
      })
    }
    if (durationTime !== undefined) {
      this.setData({
        durationTime
      })
    }
    if (currentTime !== undefined) {
      // 根据当前时间改变进度
      this.updateProgress(currentTime)
    }
    if (lyricInfos) {
      this.setData({
        lyricInfos
      })
    }
    if (currentLyricText) {
      this.setData({
        currentLyricText
      })
    }
    if (currentLyricIndex !== undefined) {
      // 修改lyricScrollTop
      this.setData({
        currentLyricIndex,
        lyricScrollTop: currentLyricIndex * 35
      })
    }
    if (isPlaying !== undefined) {
      this.setData({
        isPlaying
      })
    }
    if (playModeIndex !== undefined) {
      this.setData({
        playModeName: modeNames[playModeIndex]
      })
    }
  },

  /**
   * 获取当前播放列表
   */
  getPlaySongInfosHandler({
    playSongList,
    playSongIndex
  }) {
    if (playSongList) {
      this.setData({
        playSongList
      })
    }
    if (playSongIndex !== undefined) {
      this.setData({
        playSongIndex
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取设备信息
    this.setData({
      contentHeight: app.globalData.contentHeight
    })

    // 获取传入的id
    const id = options.id
    // 根据id播放歌曲
    if (id) {
      playerStore.dispatch("playMusicWithSongIdAction", id)
    }
    // 获取store共享数据
    playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler)
  },
})