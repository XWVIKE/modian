// miniprogram/pages/article/article.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    isiOS: app.globalData.isiOS,
    system: app.globalData.system,
    btn: app.globalData.btn,
    showMask:false,
    _id:'',
    ok:false,
    nodes:'',
    title:'',
    messageNum:0,
    like:0,
    message:[],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    let that = this;
    let _id = options._id;
    const db = wx.cloud.database();
    db.collection('article').doc(_id).get().then(res=>{
      that.setData({
        nodes:res.data.content.html,
        title:res.data.title,
        messageNum:res.data.message.length,
        like:res.data.like,
        _id:_id,
        message:res.data.message,
      })
    });
  },
  changeMask:function(){
    this.setData({showMask:!this.data.showMask})
  },
  sendMessage:function(){
    const db = wx.cloud.database();
    const data = {};
    db.constructor('article').doc(this.data._id).update({
      data:{
        $push:{
          message:{...data}
        }
      },
      success:res=>{
        wx.showToast({
          icon:'success',
          title:'留言成功'
        })
      },
      fail:e=>{
        wx.showToast({
          icon:'none',
          title:'留言失败'
        })
      }
    })
  },
  changeInput:function(e){
    console.log(e)
    this.setData()
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})