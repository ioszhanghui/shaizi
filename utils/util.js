function requestShopList(param, callBack) {
  var paramStr = JSON.stringify(param);
  console.log(paramStr + "请求的参数");
  wx.request({
    url: 'http://123.57.70.38:8888/JJDKWeb/MarchProductInfo.spring',
    data: {
      paramJson: paramStr
    },
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {

      var result = res.data;
      if (result.code == 200) {
        callBack(result.data);
      } else if (result.code == 300) {
        wx.showToast({
          title: result.message,
        })
      }
    },
    fail: function (error) {
      wx.showLoading({
        title: '加载失败!',
      })
    }
  })
}
/** 
  * 
  * json转字符串 
  */
function stringToJson(data) {
  return JSON.parse(data);
}
/** 
  *字符串转json 
  */
function jsonToString(data) {
  return JSON.stringify(data);
}
module.exports = {
  requestShopList: requestShopList
}