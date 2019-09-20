// pages/me_feedback/me_feedback.js
//获取应用实例
const app = getApp()
let dictionary = {
  wait: '待受理',
  active: '受理中',
  completed: '预约成功',
  failed: '预约失败',
  cancel: '已撤销'
}
Date.prototype.format = function(fmt) {

}

Page({
  data:{
    appointment: {},
    dictionary: dictionary,
    showMask: false,
    showRebook: false
  },
  Dateformat: function(day){
    let date = new Date(day);
    let fmt = "yyyy-MM-dd hh:mm:ss";
    var o = {
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt;
  },
  onShowMask: function(){
    this.setData({showMask: true})
  },
  onHideMask: function(){
    this.setData({showMask: false})
  },

  bindDateChange: function (e) {
    this.setData({
      regDate: e.detail.value
    })
  },
  onCancel: function(){
    let bid = this.data.id;
    const ctx = this;
    const credentials = app.getCredentials();
    wx.request({
      url: `https://www.rongjiangcommunity.cn/api/doctor/booking/cancel/${credentials}/${bid}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },

      success(res) {
        if(res.data.success){
          app.failAlert("撤销成功！");
          setTimeout(function(){
            wx.navigateTo({
              url: '../my_appointment/my_appointment',
            })
          }, 3000)
        }
      },
      fail() {
        app.failAlert("请求失败！");
        reject();
      }
    });
  },
  onOpenRebook: function(){
    this.setData({ showRebook: true})
  },
  onCloseRebook: function () {
    this.setData({ showRebook: false })
  },
  onRebook: function(e){
    let bid = this.data.id;
    const ctx = this;
    const credentials = app.getCredentials();
    var data = e.detail.value;
    if (!data.note || !this.data.note) { app.failAlert('请输入预约内容'); return }
    if (!data.regDate || !this.data.regDate) { app.failAlert('请选择预约时间'); return }
    wx.request({
      url: `https://www.rongjiangcommunity.cn/api/doctor/booking/rebook/${credentials}/${bid}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        regDate: data.regDate,
        note: data.note
      },
      success(res) {
        if(res.data.success){
          app.failAlert("重新提交预约，请等候预约进度！");
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          }, 3000)
        } else {
          app.failAlert("提交失败，请向管理员反馈问题！");
        }
      },
      fail() {
        app.failAlert("请求失败！");
        reject();
      }
    });
  },
  onLoad: function (options) {
    const ctx = this;
    const credentials = app.getCredentials();

    wx.setNavigationBarTitle({
      title: '预约详情'
    })
    wx.request({
      url: `https://www.rongjiangcommunity.cn/api/doctor/booking/${credentials}/${options.id}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if(res.data.success){
          let appointment = res.data.data;
          appointment.update_time = ctx.Dateformat(appointment.update_time)
          appointment.create_time = ctx.Dateformat(appointment.create_time)
          ctx.setData({
            appointment: res.data.data,
            id: options.id,
            regDate: res.data.data.reg_date,
            note: res.data.data.note
          })
        }
      },
      fail() {
        ctx.failAlert("请求失败！");
        reject();
      }
    });
  },

  onShow: function () {

  },


})
