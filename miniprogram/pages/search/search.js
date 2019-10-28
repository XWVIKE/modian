// miniprogram/pages/search/search.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isiOS: app.globalData.isiOS,
    system: app.globalData.system,
    btn: app.globalData.btn,
    inputValue: '',
    searchResult:[],
    clean:'取消',
    showResult:false,
    hotTag: [
      '小程序开发', '发动反撒微信', '热发动ewdsa点', '我ewe中国', '时尚', '汽车', '数码', '动漫', '旅游', '美食'
    ],
    placeholder:'',
  },
  changeInput:function(e){
    let str = e.detail.value;
    if(str.length>0){
      this.setData({
        clean: '清除',
        inputValue: str,
      })
    }else{
      this.setData({
        clean:'取消',
        inputValue: str,
      })
    }
  },
  search:function(){
    wx.cloud.callFunction({
      name:'search',
      data:{
        str:this.data.inputValue,
      },
      success:res=>{
        this.setData({searchResult:[...res.result.data]});
        this.setData({showResult:true})
      },
      fail:e=>{
        console.log(e)
      }
    })
  },
  clean:function(){
    if(this.data.inputValue.length<=0){
      wx.navigateBack();
    }else{
      this.setData({
        inputValue: '',
        clean: '取消'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})