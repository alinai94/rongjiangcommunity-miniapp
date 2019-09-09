//index.js
//获取应用实例
const app = getApp()

Page({
  pageState: 'index', // index, loading, error
  tab: 'index',
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showGetUserInfo: false,
    hasUserInfo: false,
    userInfo: null,
    user: null,
    applyInfo: null,
    approved: wx.getStorageSync('isXiaoyou'),
    status: '',
    productName: getApp().productName
  },
  onReady() {
  },
  onShow: function(){
  },
  onLoad: function() {
    const ctx = this;
    //授权判断
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          app.getWxUserInfo().then(userInfo => {
            ctx.setData({
              hasUserInfo: true,
            });
          });
        }
        wx.switchTab({
          url: '../header/header'
        });
      }
    });
  },

  bindGetUserInfo: function(e) {
    const ctx = this;
    if (e.detail.userInfo){
      app.getWxUserInfo().then(userInfo => {
        app.synWxInfo(userInfo);
        ctx.setData({
          hasUserInfo: true,
        });
        wx.switchTab({
          url: '../header/header'
        });
      });

    } else {
      //用户按了拒绝按钮
    }
  },
  //事件处理函数
  gotoRegister: function(){
    wx.navigateTo({
      url: '../register/register'
    });
  },
  //未开通入口
  expect : function(){
    wx.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 3000,
    });
  },
  jumpToMsgCenter: function(){ // 跳到消息中心，也就是右上角的泡泡图标
    console.log('jumpToMsgCenter');
  },
  showGetUserInfoView: function(e){
    this.setData({
      showGetUserInfo: true,
    });
  },
  hideGetUserInfoView: function(e){
    this.setData({
      showGetUserInfo: false,
    });
  },
});
