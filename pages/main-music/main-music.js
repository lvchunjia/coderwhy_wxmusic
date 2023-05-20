// pages/main-music/main-music.js
import {
  throttle
} from 'underscore'

import {
  getMusicBanner,
  getSongMenuList
} from "../../services/music"
import querySelect from "../../utils/query-select"
import recommendStore from "../../store/recommendStore"
import playerStore from "../../store/playerStore"
import rankingStore, {
  rankingsMap
} from "../../store/rankingStore"

const querySelectThrottle = throttle(querySelect, 100)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 搜索框
    searchValue: "",
    // 轮播图
    banners: [],
    bannerHeight: 0,
    screenWidth: 375,
    // 推荐歌曲
    recommendSongs: [],
    // 热门歌单
    hotMenuList: [],
    // 推荐歌单
    recMenuList: [],
    // 巅峰榜数据
    isRankingData: false,
    rankingInfos: {},
    // 当前正在播放的歌曲信息
    currentSong: {},
    isPlaying: false
  },

  /**
   * 搜索框点击事件
   */
  onSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search'
    })
  },

  /**
   * 图片加载完毕回调
   */
  onBannerImageLoad(event) {
    querySelectThrottle(".banner-image").then(res => {
      this.setData({
        bannerHeight: res[0].height
      })
    })
  },

  /**
   * 推荐歌曲点击事件
   */
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },

  /**
   * 推荐歌曲点击详情
   */
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.recommendSongs)
    playerStore.setState("playSongIndex", index)
  },

  /**
   * 播放工具栏播放事件
   */
  onPlayOrPauseBtnTap() {
    playerStore.dispatch("changeMusicStatusAction")
  },

  /**
   * 播放工具栏跳转播放详情
   */
  onPlayBarAlbumTap() {
    wx.navigateTo({
      url: '/packagePlayer//pages/music-player/music-player',
    })
  },

  /**
   * 轮播图请求
   */
  async fetchMusicBanner() {
    const res = await getMusicBanner()
    this.setData({
      banners: res.banners
    })
  },

  /**
   * 推荐歌曲数据
   */
  handleRecommendSongs(value) {
    if (!value.tracks) return
    this.setData({
      recommendSongs: value.tracks.slice(0, 6)
    })
  },

  /**
   * 获取歌单数据
   */
  async fetchSongMenuList() {
    // 热门歌单
    getSongMenuList().then(res => {
      this.setData({
        hotMenuList: res.playlists
      })
    })

    // 推荐歌单
    getSongMenuList("华语").then(res => {
      this.setData({
        recMenuList: res.playlists
      })
    })
  },

  /**
   * 获取巅峰榜数据
   */
  getRankingHandler(ranking) {
    return value => {
      if (!value.name) return
      this.setData({
        isRankingData: true
      })
      const newRankingInfos = {
        ...this.data.rankingInfos,
        [ranking]: value
      }
      this.setData({
        rankingInfos: newRankingInfos
      })
    }
  },

  /**
   * 获取播放工具栏数据
   */
  handlePlayInfos({
    currentSong,
    isPlaying
  }) {
    if (currentSong) {
      this.setData({
        currentSong
      })
    }
    if (isPlaying !== undefined) {
      this.setData({
        isPlaying
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取轮播图数据
    this.fetchMusicBanner()
    // 获取推荐歌曲
    recommendStore.onState("recommendSongInfo", this.handleRecommendSongs)
    recommendStore.dispatch("fetchRecommendSongsAction")
    // 获取热门歌单
    this.fetchSongMenuList()
    // 获取巅峰榜
    for (const key in rankingsMap) {
      rankingStore.onState(key, this.getRankingHandler(key))
    }
    rankingStore.dispatch("fetchRankingDataAction")

    // 播放工具栏
    playerStore.onStates(["currentSong", "isPlaying"], this.handlePlayInfos)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    recommendStore.offState("recommendSongs", this.handleRecommendSongs)
    for (const key in rankingsMap) {
      rankingStore.offState(key, this.getRankingHandler(key))
    }
    playerStore.offStates(["currentSong", "isPlaying"], this.handlePlayInfos)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})