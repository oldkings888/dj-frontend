const app = getApp()
Page({
  data:{
    searchValue:'',
    newsList:"",
    newsListContent:'',
    newsListTitle:'',
    contents:''
  },

  onLoad:function(sourse){
    var that=this
    this.setData({
      searchValue:sourse.sourse
    })
    var searchValue = this.data.searchValue
    wx.request({
      url: app.globalData.server + '/search/' + searchValue,
      success: function (res) {
        console.log(res.data)
        for (let i=0;i<res.data.length;i++) {
          res.data[i].content = res.data[i].content.replace(/<font color='red'>/g,"<span style='color:red;'>")
          res.data[i].content = res.data[i].content.replace(/<\/font>/g,"</span>")
          res.data[i].content = res.data[i].content.replace(/\\n/g, "")
        }
        that.setData({
          newsList:res.data
        })  
        console.log(that.data.newsList)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  wxsearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  searchNews(e){
    var that = this
    var searchValue = this.data.searchValue
    console.log(searchValue)
    wx.request({
      url: app.globalData.server + '/search/' + searchValue,
      success: function (res) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].content = res.data[i].content.replace(/<font color='red'>/g, "<span style='color:red;'>")
          res.data[i].content = res.data[i].content.replace(/<\/font>/g, "</span>")
          res.data[i].content = res.data[i].content.replace(/\\n/g, "")
        }
        console.log(res.data)
        that.setData({
          newsList: res.data
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  checkDetails(e){
    var that=this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '../message/message?sourse='+id })
  },
  copyText: function () {
    var that=this
    var searchValue = this.data.searchValue
    this.setData({
      contents: app.globalData.server +"/previewpdf1/"+searchValue
    })
    console.log(this.data.contents)
    wx.setClipboardData({
      data: that.data.contents,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制链接成功'
            })
          }
        })
      }
    })
  }
})
