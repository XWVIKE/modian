//index.js
const app = getApp()

Page({
  data: {
     avatarUrl: './user-unlogin.png',
    userInfo: {},
    takeSession: false,
    requestResult: '',
    isiOS: app.globalData.isiOS,
    system: app.globalData.system,
    btn: app.globalData.btn,
    hotSearch: '微信小程序',
    detail: 0,
    rec: [],
    fuck: '',
    hot: []
  },
  goEdit:function(){
    if(app.globalData.logged){
      wx.navigateTo({
        url: '../edit/edit',
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
      }
  },
  aa: function(e) {
    this.setData({
      detail: e.detail.current
    })
  },
  scrollTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  onLoad: function() {
    wx.setStorageSync("newArt", "")
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid;
        let c = res.result.data;
        let b = c.map((i) => {
          return i.data
        });

        this.setData({
          rec: b.slice(0, 3),
          hot: b.reverse(),
          fuck: res.result.hotWord[0].text
        })
        app.globalData.hotWord = res.result.hotWord;
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)

      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框;
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              app.globalData.logged = true;
              // this.setData({
              //   userInfo: res.userInfo
              // });

            }
          })
        } else {
          app.globalData.logged = false;
        }
      },
      fail: e => {
        app.globalData.logged = false;
      }
    })
  },
  // onGetUserInfo: function(e) {
  //   if (!this.data.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })

  //   }
  // },
  onShow: function() {
    if (wx.getStorageSync("newArt") === "") {
      return
    } else {
      let hot = this.data.hot;
      let data = wx.getStorageSync("newArt");
      hot.unshift({ ...data
      });
      this.setData({
        hot: hot
      })
      wx.setStorageSync("newArt", "");
      console.log(this.data.hot)
    }
  },
  onPullDownRefresh: function() {
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('hotArt').where({
      num:_.lte(100)
    }).get({
      success:res=>{
        wx.showToast({
          title: '刷新成功',
        })
        wx.stopPullDownRefresh();
        wx.vibrateShort();
        this.setData({
          rec: res.data(0, 3),
          hot: res.data,
        })
      },
      fail:e=>{
        wx.showToast({
          icon:'none',
          title: '刷新失败',
        })
      }
    });
  },
})