// miniprogram/pages/edit/edit.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isiOS: app.globalData.isiOS,
    system: app.globalData.system,
    btn: app.globalData.btn,
    showStatus: true,
    formats: {},
    readOnly: false,
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    files: [],
    // 文章信息
    openid: app.globalData.openid,
    titleImage: '',
    title: '',
    content: '',
    message: [],
    time: '',
    isIncognito: false,
    hideTime: false,
    unallowMessage: false,
    sandMod: false,
    like: 0,

    selectImgIndex: null,
    imageList: [...Array(5).keys()].map((i) => {
      return Math.floor(Math.random() * 100)
    }).map((i) => {
      return `https://picsum.photos/id/${i}/200/200`
    })
  },

  onLoad() {
    const platform = wx.getSystemInfoSync().platform;
    const isIOS = platform === 'ios'
    this.setData({
      isIOS
    })
    const that = this
    this.updatePosition(0);
    let keyboardHeight = 0;
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight - this.data.btn.bottom - 10 - 55) : (windowHeight-toolbarHeight - this.data.btn.bottom - 10 - 55)
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  titleInput: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  switchChange: function(e) {
    let index = e.currentTarget.dataset.index;
    let bool = e.detail.value;
    let temp = index === '0' ? 'isIncognito' : index === '1' ? 'isShowEditTime' : index === '2' ? 'allowMessage' : 'sandMod';
    this.setData({
      [temp]: bool
    })
  },
  sendArt: function() {

    const d = this.data;
    if (d.title.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: "请完善标题",
      })
    } else if (d.content.text.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: '请完善内容',
      })
    } else if (d.titleImage === '') {
      wx.showToast({
        icon: 'none',
        title: '请选择封面图片',
      })
    } else {
      
      const that = this;
      const db = wx.cloud.database();
      let data = {
        openid: d.openid,
        titleImage: d.titleImage,
        title: d.title,
        content: d.content,
        message: [],
        time: new Date().getTime(),
        isIncognito: d.isIncognito,
        hideTime: d.hideTime,
        unallowMessage: d.unallowMessage,
        sandMod: d.sandMod,
        like: 0,
        reserved1: '',
        reserved2: 0,
        reserved3: {},
        reserved4: [],
      }
      db.collection('article').add({
        data: { ...data
        },
        success: res => {
          data["_id"] = res._id;
          wx.setStorageSync("newArt", data)
          that.setData({
            content: '',
            title: ''
          });
          wx.setStorageSync("content", "");
          that.editorCtx.clear();
          app.globalData.sendArt_id = res._id;
          wx.showToast({
            title: '发表成功',
          });
          wx.redirectTo({
            url: '../article/article?_id='+res._id
          })
        },
        fail: e => {
          wx.showToast({
            icon: 'none',
            title: '文章发表失败',
          })
        }
      })
    }
  },
  changeShowStatus: function() {
    this.setData({
      showStatus: !this.data.showStatus
    })
  },
  closeFUCK: function() {
    this.setData({
      showStatus: true
    })
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function(res) {
      that.editorCtx = res.context;
      if (wx.getStorageSync('content')) {
        that.setData({
          content: wx.getStorageSync("content")
        })
        that.editorCtx.setContents({
          html: wx.getStorageSync("content").html,
          success: res => {
            console.log(res)
          },
          fail: e => {
            console.log(e);
          }
        })
      }
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  clear() {
    this.editorCtx.clear({
      success() {
        console.log('clear success')
      }
    })
  },
  // 编辑内容样式改变
  onStatusChange(e) {
    const formats = e.detail;
    this.setData({
      formats
    })
  },
  // 编辑内容改变
  onContentChange(e) {
    this.setData({
      content: e.detail,
    });
    wx.setStorageSync("content", e.detail)
  },

  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  clear() {
    this.editorCtx.clear({
      success: function(res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],

      success: function(res) {
        const filePath = res.tempFilePaths[0];
        const cloudPath = (Math.random() * 1000000).toString(32).substr(0, 4) + new Date().getTime() + filePath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.editorCtx.insertImage({
              src: res.fileID,
              width: '80%',
              success: function() {
                console.log('insert image success')
              }
            })
          }
        })
      }
    })
  },
  doUpload: function() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '正在上传',
        });
        const filePath = res.tempFilePaths[0];
        const cloudPath = (Math.random() * 1000000).toString(32).substr(0, 4) + new Date().getTime() + filePath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.setData({
              imageList: [...that.data.imageList, filePath],
              selectImgIndex: that.data.imageList.length,
              titleImage: res.fileID,
            });
          },
          fail: e => {
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
  selectImg: function(e) {
    let that = this;
    let index = parseInt(e.currentTarget.dataset.index);
    let url = this.data.imageList[index];
    if (index === this.data.selectImgIndex) {
      this.setData({
        selectImgIndex: null,
        titleImage: ''
      })
    } else {
      this.setData({
        selectImgIndex: index,
        titleImage: url
      })
    }
  },
})