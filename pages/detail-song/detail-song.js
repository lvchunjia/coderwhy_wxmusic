// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import playerStore from "../../store/playerStore"
import {
  getPlaylistDetail
} from "../../services/music"

Page({
  data: {
    type: "ranking",
    key: "newRanking",
    id: "",
    songInfo: {}
  },

  // ================== wxml事件监听 ==================
  onSongItemTap() {
    playerStore.setState("playSongList", this.data.songInfo.tracks)
  },

  /**
   * 更新榜单数据
   */
  handleRanking(value) {
    this.setData({
      songInfo: value
    })
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },

  /**
   * 获取歌单列表
   */
  async fetchMenuSongInfo() {
    const res = await getPlaylistDetail(this.data.id)
    this.setData({
      songInfo: res.playlist
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type
    this.setData({
      type
    })

    // 获取榜单数据
    switch (type) {
      case "ranking":
        const key = options.key
        this.data.key = key
        rankingStore.onState(key, this.handleRanking)
        break;
      case "recommend":
        recommendStore.onState("recommendSongInfo", this.handleRanking)
        break;
      case "menu":
        const id = options.id
        this.data.id = id
        this.fetchMenuSongInfo()
        break;
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    switch (this.data.type) {
      case "ranking":
        rankingStore.offState(this.data.key, this.handleRanking)
        break;
      case "ranking":
        recommendStore.offState("recommendSongInfo", this.handleRanking)
        break;
    }
  }
})