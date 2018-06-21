//index.js
//获取应用实例
const app = getApp()
var commen =require("../../commen/commen.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:5,
    lists: [],
    saizi:["http://p8x4grwe5.bkt.clouddn.com/SZ_01@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_02@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_03@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_04@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_05@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_06@2x.png"
    ],
    indexs:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    resetList:[],//点击之后所有的都重置回去
    flag:false,
    screenHight:0,
    imageSize:17,
    selectImage:"http://p8x4grwe5.bkt.clouddn.com/select@3x.png",
    selectSoundHidden:true,
    selectShakeHidden:true
  },
  onReady:function(){
    //创建音频加载对象
    this.audioObj = wx.createAudioContext("shakeAudio", this);
    this.audioObj.setSrc('../../Resource/shake.mp3');

  var that = this;
    /*获取系统的屏宽屏高*/
    wx.getSystemInfo({
      success: function (res) {
        /*保存屏幕的宽高信息*/
        app.globalData.screenWidth = res.screenWidth;
        app.globalData.screenHeight = res.screenHeight;
        app.globalData.nviHight = res.screenHeight - res.windowHeight;
        console.log(res.statusBarHeight+"状态栏的高度");
        console.log("屏宽" + app.globalData.screenWidth + "高" + app.globalData.screenHeight + "导航调" + app.globalData.nviHight);
        that.setData({
          screenHight: res.screenHeight
        })
      },
    })

  },
  /*筛子的可滚动区域*/
  setSaiziScrollPoint:function() {
    /*全是px*/
    var screenwidth = app.globalData.screenWidth;//屏宽
    var saiziWidth = 76;//筛子的大小
    var margin = 10;
    //最左边的位置
    var minX = margin;
    //最右边的位置
    var maxX = screenwidth - margin - 76;
    /*最小的*/
    var minY = app.globalData.nviHight + 20 + margin;
    /*最大的*/
    var maxY = app.globalData.screenHeight - 55 - 64 - 20 - 76;
    var point = {
      left: Math.ceil(commen.randomValue(minX, maxX)),
      top: Math.ceil(commen.randomValue(minY, maxY)),
      imageUrl: this.data.saizi[Math.round(Math.random() * 5)],
      animation:{}
    };
    return point;
  },
  /*查询数据是否重复*/
  isRepeatData:function(point){
    var repeat = false;
    for (var i = 0; i < this.data.lists.length;i++){
      var leftPoint = this.data.lists[i];
    var offsetLeft = Math.abs(point.left - leftPoint.left);
    var offsetTop = Math.abs(point.top - leftPoint.top);
    if (offsetLeft < (76 + 5) && offsetTop < 76 + 5) {
      console.log("重点");
      repeat = true;
      break;
    }
}
return repeat;
},

  /*产生筛子的点*/
  addSaiziPoint:function(){
    for (var i = 0; i < this.data.count;i++){
  //产生一个随机点
  var point = this.setSaiziScrollPoint();
  while (this.isRepeatData(point)) {
    point = this.setSaiziScrollPoint();
  }
  /*创建动画*/
  var animation = wx.createAnimation({
    duration: 2000,
    timingFunction: 'linear'
  });
  animation.translate(point.left+76, point.top+76).rotate(180).step({
    delay:500
  }).rotate(0).step({
    duration:0,
    timingFunction: 'linear'
  });
  point.animation = animation.export();
  console.log("左边" + point.left + "顶部" + point.top);
  this.data.lists.push(point);
}
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /*加速剂摇晃事件*/
    var that = this;
    console.log(that+"");
    wx.onAccelerometerChange(function(res){
      if(res.x>0.3&&res.y>0.3){
        console.log("加速计摇晃");
        //创建音频加载对象
        console.log(that.data.selectSoundHidden + "塞子");
        if (that.data.selectSoundHidden){
          this.audioObj = wx.createAudioContext("shakeAudio", this);
          this.audioObj.setSrc('http://p8x4grwe5.bkt.clouddn.com/shake.mp3');
          this.audioObj.play();
        }

        //获取坐标点
        if (that.data.lists.length>0) {
          that.resetTranslate();
        }
        //获取坐标点
        that.data.lists.length = 0;//清空数组
        //清除视图数据
        setTimeout(function () {
          that.addSaiziPoint();
          that.setData({
            lists: that.data.lists
          });
        }, 50);
      }
    })
  },
  /*点击关闭*/
  closeAction:function(){
    /*关闭弹窗*/
    this.setData({
      flag:!this.data.flag
    });
  },
  /*点击勾选不勾选*/
  gouSelect:function(){

  },
  /*增加筛子的个数*/
  addNumber:function(){
    if (this.data.count>=10){
      return;//最多10个
    }
    //获取坐标点
    if (this.data.lists.length > 0) {
      this.resetTranslate();
    }
    //获取坐标点
    this.data.lists.length = 0;//清空数组
    this.setData({
      count: ++this.data.count,
      lists: this.data.lists
    });
  },
  /*减少筛子的个数*/
  reduceNumber:function(){
    if (this.data.count<=1){
      return;//最少一个
    }
    //获取坐标点
    if (this.data.lists.length > 0) {
      this.resetTranslate();
    }
    //获取坐标点
    this.data.lists.length = 0;//清空数组

    this.setData({
      count: --this.data.count,
      lists: this.data.lists
    });
  },
  /*把所有的数据 都重置了*/
  resetTranslate:function(){
    for(var i=0;i<this.data.lists.length;i++){
      //取出所有的数据 都让它回到原点
      var obj =this.data.lists[i];
      var ani= wx.createAnimation({
        duration:0,
        timingFunction:"linear"
      })
      ani.translate(-obj.left,-obj.top).step();
      obj.animation =ani.export();
    }
  //重置一下 返回原点
    this.setData({
      lists:this.data.lists
    })
  },
  /*设置*/
  setAction:function(){ 
    //创建音频加载对象
    this.audioObj = wx.createAudioContext("shakeAudio", this);
    this.audioObj.setSrc('http://p8x4grwe5.bkt.clouddn.com/button.mp3');
    this.audioObj.play();
  /*打开弹窗*/
  this.setData({
    flag:!this.data.flag
  })
 },
 /*取消音效*/
  quxiaoSound:function(){
    this.setData({
      selectSoundHidden:!this.data.selectSoundHidden
    })
  },
  quxiaoShake: function () {
    this.setData({
      selectShakeHidden: !this.data.selectShakeHidden
    })
  }
})