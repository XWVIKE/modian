// miniprogram/pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isiOS: app.globalData.isiOS,
    system: app.globalData.system,
    btn: app.globalData.btn,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onGetUserInfo: function (e) {
    if (!app.globalData.logged && e.detail.userInfo) {
      app.globalData.logged = true;
      app.globalData.userInfo = e.detail.userInfo;
      // this.setData({
      //   logged: true,
      //   avatarUrl: e.detail.userInfo.avatarUrl,
      //   userInfo: e.detail.userInfo
      // })
      let page = getCurrentPages();
      let tempurl = page[page.length - 2];
      let url, option = Object.keys(tempurl.options);

      if (option.length <= 0) {
        url = tempurl.route.replace(/pages/, "..");
      } else {
        url = tempurl.route.replace(/pages/, "..") + "?" + option[0] + "=" + tempurl.options[option[0]]
      }
      wx.navigateTo({
        url: url,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})