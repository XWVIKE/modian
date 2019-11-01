// miniprogram/pages/aboutme/aboutme.js
const app = getApp();
Page({
  data: {
    isiOS: app.globalData.isiOS,
    system: app.globalData.system,
    btn: app.globalData.btn,
    userInfo: '',
    logged:true,
    artList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let logged = app.globalData.logged;
    if(logged){
      const {
        userInfo
      } = app.globalData;
      wx.cloud.callFunction({
        name: 'requestArtList',
        data: {
          openid: app.globalData.openid
        },
        success: res => {
          this.setData({ artList: [...res.result.data] })
        },
        fail: console.error
      })
      this.setData({
        userInfo: userInfo
      });
    }else{
      this.setData({
        logged:false,
        userInfo: {avatarUrl:"./user-unlogin.png"}
        })
    }
  },
  login:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})