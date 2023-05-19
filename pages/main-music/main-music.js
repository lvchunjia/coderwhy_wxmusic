// pages/main-music/main-music.js
import {
  throttle
} from 'underscore'

import {
  getMusicBanner,
  getSongMenuList
} from "../../services/music"
import querySelect from "../../utils/query-select"

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

    // 歌单数据
    hotMenuList: [],
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

  // 轮播图请求
  async fetchMusicBanner() {
    const res = await getMusicBanner()
    this.setData({
      banners: res.banners
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchMusicBanner()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})