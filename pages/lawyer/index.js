// pages/consult/consult.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset:0,
    lawyerList:[],
    isLawyer: false,
    infoPro:'刑事辩护及控告，企业刑事风险防护，刑民交叉案件和其他相关方面的案件'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const credentials = app.getCredentials();
    this.getLawyerList()
    const that=this;
    this.getWindowHeight();
    wx.setNavigationBarTitle({
      title: '律师咨询'
    });
    // 检测用户是否是律师
    wx.request({
      url: app.serverUrl + '/api/lawyer/is_lawyer/' + credentials,
      success(res){
        if(res.data.success){
          that.setData({
            isLawyer : res.data.data,
          })
        }
      }
    });
    //判断user是否有消息未读
    wx.request({
      url: app.serverUrl + '/api/lawyer/user_has_unread/' + credentials,
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.data.success) {
          that.setData({
            userMsg: res.data.data,
          });
        }
      }
    });
    //判断lawyer是否有消息未读
    wx.request({
      url: app.serverUrl + '/api/lawyer/lawyer_has_unread/' + credentials,
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.data.success) {
          that.setData({
           lawyerMsg: res.data.data,
          });
        }
      }
    })
  },
 // 获取律师列表
  getLawyerList:function(e){
    let that = this;
    const credentials = app.getCredentials();
    wx.request({
      url: app.serverUrl + '/api/lawyer/lawyers/' + credentials,
      success(res) {
        if (res.data.success === true) {
          that.setData({
            lawyerList: res.data.data,
          });
        }
      }
    })
  },
  // 跳转至律师主页
  goToLawyer:function(e){
    const id = e.currentTarget.dataset.info.id
    wx.navigateTo({
      url: './detail/index?id='+id
    })
  },
  showModal:function(){
    this.setData({
      showModalJoin: true
    })
  },
  onCancel:function(){
    this.setData({
      showModalJoin:false
    })
  },
  callNow:function(){
    wx.makePhoneCall({
      phoneNumber: '13903013645',
    });
  },
  getWindowHeight:function(){
    const that=this;
    wx.getSystemInfo({
      success: function (res) {
        const windowHeight = res.windowHeight;
        const windowWidth=res.windowWidth;
        let scrollHeight = windowHeight * 750 / windowWidth - 222;
        that.setData({
          scrollHeight: scrollHeight,
        });
      }
    });
  },
  //分页触底操作
  lowerMoreLawyers:function(e){
    let that = this;
    that.setData({
      offset: that.data.offset + that.data.count,
    })
    that.getLawyerList(); //重新获取信息
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
