// pages/detail-menu/detail-menu.js
import {
  getSongMenuTag,
  getSongMenuList
} from "../../services/music"

Page({
  data: {
    songMenus: []
  },

  // 发送网络请求
  async fetchAllMenuList() {
    // 获取tags
    const tagRes = await getSongMenuTag()
    const tags = tagRes.tags

    // 根据tags获取对应的歌单
    const allPromises = []
    for (const tag of tags) {
      const promise = getSongMenuList(tag.name)
      allPromises.push(promise)
    }

    // 获取所有的数据
    Promise.all(allPromises).then(res => {
      this.setData({
        songMenus: res
      })
    })
  },

  onLoad() {
    this.fetchAllMenuList()
  },
})