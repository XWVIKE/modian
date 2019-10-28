//index.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: true,
    takeSession: false,
    requestResult: '',
    isiOS: app.globalData.isiOS,
    system: app.globalData.system,
    btn: app.globalData.btn,
    hotSearch: '微信小程序',
    detail: 0,
    rec: [{
        img: '../../images/1.jpg',
        link: ''
      },
      {
        img: '../../images/2.jpg',
        link: ''
      },
      {
        img: '../../images/3.jpg',
        link: ''
      },
    ],
    hot: [{
        num: 1,
        url: '../../images/1.jpg',
        title: '开始写一个完整得到小程序，需要把标题完整的写完，尽量写长一点。开始写一个完整得到小程序，需要把标题完整的写完，尽量写长一点。',
        text: '剩余的空间是其他文字，或者内容。',
        link: ''
      },
      {
        num: 2,
        url: '../../images/2.jpg',
        title: '第二条测试文章题目',
        text: '这个比较短。开始写一个完整得到小程序，需要把标题完整的写完，尽量写长一点。开始写一个完整得到小程序，需要把标题完整的写完，尽量写长一点。',
        link: ''
      }
    ]
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
              let data = res;
              wx.cloud.callFunction({
                name: 'createUser',
                data: {
                  openid: app.globalData.openid,
                  userName: res.userInfo.nickName
                },
                success: res => {
                  app.globalData.userInfo = res.userInfo;
                  this.setData({
                    avatarUrl: data.userInfo.avatarUrl,
                    userInfo: data.userInfo
                  });
                },
                fail: console.error
              })
            }
          })
        } else {
          this.setData({
            logged: false
          })
        }
      },
      fail: e => {
        this.setData({
          logged: false
        })
      }
    })
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      wx.cloud.callFunction({
        name: 'createUser',
        data: {
          openid: app.globalData.openid,
          userName: e.detail.userInfo.nickName
        },
        success: res => {
          this.setData({
            logged: true,
            avatarUrl: e.detail.userInfo.avatarUrl,
            userInfo: e.detail.userInfo
          })
        },
        fail:console.error
      })

    }
  },


  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})