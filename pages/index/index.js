//index.js
//获取应用实例
const app = getApp()
var commen =require("../../commen/commen.js");
/*保存产生的点*/
var lists = [];
//px为单位的点
var pxList = [];
var count=1;//默认筛子的个数
/*筛子对应的链接*/
var saizi = ["http://p8x4grwe5.bkt.clouddn.com/SZ_01@2x.png",
"http://p8x4grwe5.bkt.clouddn.com/SZ_02@2x.png",
"http://p8x4grwe5.bkt.clouddn.com/SZ_03@2x.png",
"http://p8x4grwe5.bkt.clouddn.com/SZ_04@2x.png",
"http://p8x4grwe5.bkt.clouddn.com/SZ_05@2x.png",
"http://p8x4grwe5.bkt.clouddn.com/SZ_06@2x.png"
];

/*筛子的可滚动区域*/
function setSaiziScrollPoint() {
  /*全是px*/
  var screenwidth = app.globalData.screenWidth;//屏宽
  var saiziWidth = 76;//筛子的大小
  var margin = 10;
  //最左边的位置
  var minX = margin;
  //最右边的位置
  var maxX = screenwidth - margin - commen.changeUnit(152);
  /*最小的*/
  var minY = app.globalData.nviHight + 20 + margin;
  /*最大的*/
  var maxY = app.globalData.screenHeight - commen.changeUnit(110) - 64 - 20 - commen.changeUnit(152);
  var point = {
    left: Math.ceil(commen.randomValue(minX, maxX)),
    top: Math.ceil(commen.randomValue(minY, maxY)),
    imageUrl: saizi[Math.round(Math.random() * 5)],
   };
  return point;
}
/*查询数据是否重复*/
function isRepeatData(point){
  var repeat =false;
  for (var i = 0; i < pxList.length;i++){
    var leftPoint = pxList[i];
    var offsetLeft = Math.abs(point.left-leftPoint.left);
    var offsetTop = Math.abs(point.top-leftPoint.top);
    console.log("**********"+"offsetLeft" + offsetLeft + "offsetTop" + offsetTop);
    if (offsetLeft < (commen.changeUnit(152) + 5) && offsetTop < commen.changeUnit(152)+5 ){
      console.log("重点");
      repeat = true;
      break;
    }
  }
  return repeat;
}

/*产生筛子的点*/
function addSaiziPoint(){

  for (var i = 0; i < count;i++){
    //产生一个随机点
    var point = setSaiziScrollPoint();
    while (isRepeatData(point)) {
      point = setSaiziScrollPoint();
    }
    console.log(point.left+"top"+point.top);
    /*创建动画*/
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'linear',
      // transformOrigin:"0,0,0"
    });
    animation.translate(point.left, point.top).rotate(180).step();
    point.animation = animation.export();
    pxList.push(point);
    // point.left = commen.changerpx(point.left);
    // point.top = commen.changerpx(point.top);
    lists.push(point);
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:count,
    lists: lists,
    saizi: saizi,
    pxList: pxList
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /*加速剂摇晃事件*/
    var that =this;/***???????*/
    wx.onAccelerometerChange(function(res){
      console.log(res.x+"x");
      console.log(res.y+"y");
      console.log(res.z+'z');
      if(res.x>0.3&&res.y>0.3){
        console.log("加速计摇晃");
        //创建音频加载对象
        this.audioObj = wx.createAudioContext("shakeAudio", this);
        this.audioObj.setSrc('http://p8x4grwe5.bkt.clouddn.com/shake.mp3');
        this.audioObj.play();
        //获取坐标点
        lists.length = 0;//清空数组
        pxList.length = 0;
        addSaiziPoint();
        that.setData({
          lists: lists
        });
      }

    })
  },
  /*增加筛子的个数*/
  addNumber:function(){
    if(count>=10){
      return;//最多10个
    }
    this.setData({
      count:++count
    });
  },
  /*减少筛子的个数*/
  reduceNumber:function(){
    if(count<=1){
      return;//最少一个
    }
    this.setData({
      count: --count
    });
  },
  /*设置*/
  setAction:function(){ 
    //创建音频加载对象
    this.audioObj = wx.createAudioContext("shakeAudio", this);
    this.audioObj.setSrc('http://p8x4grwe5.bkt.clouddn.com/button.mp3');
    this.audioObj.play();

    //获取坐标点
    lists.length = 0;//清空数组
    pxList.length = 0;
    addSaiziPoint();
    this.setData({
      lists: lists
    });
 }
})