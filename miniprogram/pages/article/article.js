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
    input:'',
    nodes:'',
    title:'',
    like:false,
    message:[],
  },

  /**
   * Lifecycle function--Called when page load
   */
  like:function(){
    const db = wx.cloud.database();
    const _ = db.command;
    this.setData({like:!this.data.like});
    if(this.data.like){
      db.collection('article').doc(this.data._id).update({
        data:{
          like:_.inc(1)
        }
      })
    }else{
      db.collection('article').doc(this.data._id).update({
        data:{
          like:_.inc(-1)
        }
      })
    }
  },
  onLoad: function(options) {
    let that = this;
    let _id = options._id;
    const db = wx.cloud.database();
    db.collection('article').doc(_id).get().then(res=>{
      that.setData({
        nodes:res.data.content.html,
        title:res.data.title,
        // messageNum:res.data.message.length,
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
    const u = app.globalData.userInfo;
    const data = {
      userName:u.nickName,
      avatarUrl:u.avatarUrl,
      time:new Date().getTime(),
      text:this.data.input,
      spare:{}
    };
    const _ = db.command;
    db.collection('article').doc(this.data._id).update({
      data:{
        message:_.push([{...data}])
      },
      success:res=>{
        let arr = [...this.data.message];
        arr.unshift({...data});
        this.setData({
          message:[...arr],
          input:''
        });
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
    this.setData({input:e.detail.value})
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