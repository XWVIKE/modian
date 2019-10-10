Component({
  properties: {
    height: Number,
    bottom: Number,
    top: Number,
    width:Number
  },
  data: {
    textInputValue: '',
    status: 0,
  },
  attached: function() {
    let arr = getCurrentPages();
    let route = arr[arr.length - 1].route.split('/')[1];
    if (route === 'index') {
      this.setData({status:0})
    }else if(route==='search'){
      this.setData({ status: -1 })
    }else{
      this.setData({ status: 1 })
    }
  },
  methods: {
    back:function(){
      wx.navigateBack();
    },
    home:function(){
      wx.navigateBack({delta:99})
    }
  }
})