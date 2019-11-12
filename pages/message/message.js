
const app = getApp()

Page({
  data:{
    id:'',
    details:{},
    subject:'',
    subjects:''
  },
  onLoad:function(sourse){
    var that=this
    this.setData({
      id:sourse.sourse
    })
    var id=this.data.id
    wx.request({
      url: app.globalData.server + '/djDocView/' + id,
      success: function (res) {
        console.log(res)
        res.data.djDoc.content = res.data.djDoc.content.split(/\\n|n\\/)
        for (let i = 0; i < res.data.djDoc.content.length; i++) {
          res.data.djDoc.content[i] = "<p>" + res.data.djDoc.content[i] + "</p>"
        }
        that.setData({
          details: res.data.djDoc,
          subjects: res.data.subjects
        })
        console.log(that.data.details)
        if (res.data.djDoc.isSubject==='TRUE') {
          that.setData({
            subject: res.data.djDoc.subject
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  checkContents(e){
    var that=this
    var id = e.currentTarget.dataset.id
    if(id===this.data.id) {
      return false
    }
    wx.request({
      url: app.globalData.server + '/djDocView/' + id,
      success: function (res) {
        console.log(res)
        res.data.djDoc.content = res.data.djDoc.content.split(/\\n|n\\/)
        for (let i = 0; i < res.data.djDoc.content.length; i++) {
          res.data.djDoc.content[i] = "<p>" + res.data.djDoc.content[i] + "</p>"
          res.data.djDoc.content[i] = res.data.djDoc.content[i].replace(/<strong>/g, "<span style='font-weight:bold;'>")
          res.data.djDoc.content[i] = res.data.djDoc.content[i].replace(/<\/strong>/g, "</span>")
        }
        that.setData({
          id: res.data.djDoc.id,
          details: res.data.djDoc,
          subject: res.data.djDoc.subject,
          subjects: res.data.subjects
        })
        if (wx.pageScrollTo) {
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})