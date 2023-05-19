// pages/main-video/main-video.js
import {
  getTopMV
} from "../../services/video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },

  /**
   * 请求获取数据的方法
   */
  async fetchTopMV() {
    // 1.获取数据
    const res = await getTopMV(this.data.offset)
    // 2.将新的数据追加到原来数据的后面
    const newVideoList = [...this.data.videoList, ...res.data]
    // 3.设置全新的数据
    this.setData({
      videoList: newVideoList
    })
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchTopMV()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    // 1.清空之前的数据
    this.setData({
      videoList: []
    })
    this.data.offset = 0
    this.data.hasMore = true
    // 2.重新请求新的数据
    await this.fetchTopMV()
    // 3.停止下拉刷新
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 1.判断是否有更多的数据
    if (!this.data.hasMore) return
    // 2.如果有更多的数据, 再请求新的数据
    this.fetchTopMV()
  },
})