// miniprogram/pages/home/home.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isiOS: app.globalData.isiOS,
    system: app.globalData.system,
    btn: app.globalData.btn,
    detail:0,
    rec:[
      {
        img:'../../images/1.jpg',
        link:''
      },
      {
        img:'../../images/2.jpg',
        link:''
      },
      {
        img:'../../images/3.jpg',
        link:''
      },
    ],
    hot:[
      {
        num:1,
        url:'../../images/1.jpg',
        title:'开始写一个完整得到小程序，需要把标题完整的写完，尽量写长一点。开始写一个完整得到小程序，需要把标题完整的写完，尽量写长一点。',
        text:'剩余的空间是其他文字，或者内容。',
        link:''
      },
      {
        num:2,
        url:'../../images/2.jpg',
        title:'第二条测试文章题目',
        text:'这个比较短。开始写一个完整得到小程序，需要把标题完整的写完，尽量写长一点。开始写一个完整得到小程序，需要把标题完整的写完，尽量写长一点。',
        link:''
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  aa:function(e){
   this.setData({detail:e.detail.current})
  },
  scrollTop:function(){
    wx.pageScrollTo({
      scrollTop: 0,
    })
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