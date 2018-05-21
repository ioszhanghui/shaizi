
var app = getApp();
/*音乐文件播放*/
function playMusic(filepath){
  console.log("执行"+filepath);
  wx.playVoice({
    filePath: filepath,
    success:function(){
      console.log("播放完毕");
    },
    fail:function(e){
      console.log("播放失败"+e);
    }
  })
}
/*获取随机数*/
function randomValue(min,max){
  console.log(max+"最小值"+min);
  return Math.random() * (max-min)+min;
}
/*rpx -》px*/
function changeUnit(val){
  return app.globalData.screenWidth / 750 * val;
}
/*px-》px*/
function changerpx(val){
  return 750 / app.globalData.screenWidth*val;
}
module.exports={
  playMusic: playMusic,
  randomValue:randomValue,
  changeUnit: changeUnit,
  changerpx: changerpx//转化成rpx
}