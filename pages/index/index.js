//index.js
//获取应用实例
const app = getApp()
var commen =require("../../commen/commen.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:1,
    lists: [],
    saizi:["http://p8x4grwe5.bkt.clouddn.com/SZ_01@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_02@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_03@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_04@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_05@2x.png",
      "http://p8x4grwe5.bkt.clouddn.com/SZ_06@2x.png"
    ],
    pxList:[],
    indexs:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  onReady:function(){
    //创建音频加载对象
    this.audioObj = wx.createAudioContext("shakeAudio", this);
    this.audioObj.setSrc('../../Resource/shake.mp3');

    /*获取系统的屏宽屏高*/
    wx.getSystemInfo({
      success: function (res) {
        /*保存屏幕的宽高信息*/
        app.globalData.screenWidth = res.screenWidth;
        app.globalData.screenHeight = res.screenHeight;
        app.globalData.nviHight = res.statusBarHeight+44;
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
    for (var i = 0; i < this.data.pxList.length;i++){
      var leftPoint = this.data.pxList[i];
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
  animation.translate(point.left+76, point.top+76).rotate(180).step();
  point.animation = animation.export();
  console.log("左边" + point.left + "顶部" + point.top);
  this.data.pxList.push(point);
  this.data.lists.push(point);
}
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /*加速剂摇晃事件*/
    var that =this;/***???????*/
    wx.onAccelerometerChange(function(res){
      if(res.x>0.3&&res.y>0.3){
        console.log("加速计摇晃");
        //创建音频加载对象
        this.audioObj = wx.createAudioContext("shakeAudio", this);
        this.audioObj.setSrc('http://p8x4grwe5.bkt.clouddn.com/shake.mp3');
        this.audioObj.play();
        //获取坐标点
        this.data.lists.length = 0;//清空数组
        this.data.pxList.length = 0;
        addSaiziPoint();
        that.setData({
          lists: []
        });
      }

    })
  },
  /*增加筛子的个数*/
  addNumber:function(){
    if (this.data.count>=10){
      return;//最多10个
    }
    this.setData({
      count: ++this.data.count
    });
  },
  /*减少筛子的个数*/
  reduceNumber:function(){
    if (this.data.count<=1){
      return;//最少一个
    }
    this.setData({
      count: --this.data.count
    });
  },
  /*设置*/
  setAction:function(){ 
    //创建音频加载对象
    this.audioObj = wx.createAudioContext("shakeAudio", this);
    this.audioObj.setSrc('http://p8x4grwe5.bkt.clouddn.com/button.mp3');
    this.audioObj.play();

    //获取坐标点
    this.data.lists.length = 0;//清空数组
    this.data.pxList.length = 0;
    //清除视图数据
    this.setData({
      lists:[],
      pxList:[]
    });
    console.log(this.data.lists);
    this.addSaiziPoint();
    var that = this;
    
    this.setData({
      lists: this.data.lists
    });
 }
})