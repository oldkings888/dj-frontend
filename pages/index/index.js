//index.js
//获取应用实例
const windowHeight =  wx.getSystemInfoSync().windowHeight;
const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
const app = getApp()
const recorderManager = wx.getRecorderManager()
Page({
  data: {
    //标签云
    searchList: [
      '十九大报告',
      '改革开放',
      '不忘初心',
      '红船精神',
      '中国特色社会主义',
      '全面深化改革',
      '宪法',
      '一带一路',
      '全面从政严政',
      '全面建设小康社会',
      '党章',
      '脱贫攻坚',
      '全面依法治国',
      '四个意识',
      '两个维护',
      '六大纪律'
    ],
    colorArr: ['#BC9047', '#CDAE79', '#D0B485'],
    fontSizeArr: ['26rpx', '40rpx', '60rpx', '50rpx', '36rpx'],
    // 存储随机颜色
    randomColorArr: [],
    // 随机字体大小
    randomFontSizeArr: [],
    searchInput: '',
    screenHeight: windowHeight,
    statusBarHeight:statusBarHeight,
    imgUrl:'../../assets/images/huatong_1.png',
    is_clock: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this,
      colorArr = that.data.colorArr,
      colorLen = colorArr.length,
      searchList = that.data.searchList,
      searchListLen = searchList.length,
      fontSizeArr = that.data.fontSizeArr,
      fontSizeArrLen = fontSizeArr.length,
      randomColorArr = [],
      randomFontSizeArr = []

    //判断执行
    do {
      let random1 = colorArr[Math.floor(Math.random() * colorLen)]
      let random2 = fontSizeArr[Math.floor(Math.random() * fontSizeArrLen)]
      randomColorArr.push(random1)
      randomFontSizeArr.push(random2)
      searchListLen--
    } while (searchListLen > 0)

    that.setData({
      randomColorArr: randomColorArr,
      randomFontSizeArr: randomFontSizeArr
    })
  },
  click: function(e) {
    this.setData({
      searchInput: e.currentTarget.dataset.key
    })
    var searchValue = this.data.searchInput
    wx.navigateTo({ url: '../list/list?sourse=' + searchValue })
  },
  wxsearchInput(e){
    this.setData({
      searchInput: e.detail.value
    })
  },
  startSearch: function(e) {
    var searchValue = this.data.searchInput
    wx.navigateTo({ url: '../list/list?sourse=' + searchValue })
  },
  handleRecordStart: function (e) {
    this.setData({
      imgUrl:'../../assets/images/huatong_2.png',
      is_clock: true,//长按时应设置为true，为可发送状态
      startPoint: e.touches[0],//记录触摸点的坐标信息
    })
    //设置录音参数
    const options = {
      // duration: 10000,
      // sampleRate: 16000,
      // numberOfChannels: 1,
      // encodeBitRate: 48000,
      format: 'mp3'
    }
    //开始录音
    recorderManager.start(options);
  },
  handleRecordStop: function (e) {
    this.setData({
      imgUrl: '../../assets/images/huatong_1.png'
    })
    recorderManager.stop()//结束录音
    //此时先判断是否需要发送录音
    if (this.data.is_clock == true) {
      var that = this
      //对停止录音进行监控
      recorderManager.onStop((res) => {
        //对录音时长进行判断，少于2s的不进行发送，并做出提示
        if (res.duration < 1000) {
          wx.showToast({
            title: '录音时间太短，请长按录音',
            icon: 'none',
            duration: 1000
          })
        } else {
          //进行语音发送
          const {
            tempFilePath
          } = res;
          console.log(tempFilePath)
          wx.showLoading({
            title: '语音检索中',
            duration:3000
          })
          //上传录制的音频
          wx.uploadFile({
            url:'http://172.19.133.206:8888/voice',
            filePath: tempFilePath,
            name: 'file',
            header: {
              'content-type': 'multipart/form-data'
            },
            success: function (res) {
              console.log(res);
              var searchValue = JSON.parse(res.data).result
              console.log(searchValue)
              wx.navigateTo({ url: '../list/list?sourse=' + searchValue })
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      })
    }
  },
  handleTouchMove: function (e) {
    //计算距离，当滑动的垂直距离大于25时，则取消发送语音
    if (Math.abs(e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY) > 25) {
      this.setData({
        is_clock: false//设置为不发送语音
      })
    }
  }
})
