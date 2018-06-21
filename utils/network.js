var requestHandler = {
  param:{},
  url:"",
  success:function(res){

  },
  fail:function(){

  }
}
function wxRequest(method,requestHandler){
  wx.request({
    url: requestHandler.url,
    header:{
      "content-type": method == "GET" ? 'application/json' :"application/x-www-form-urlencoded"
    },
    data:requestHandler.param,
    method:method,
    success:function(res){
      requestHandler.success(res.data);
    },
    fail:function(){
      requestHandler.fail();
    }
  })
}
/*GET请求*/
function RequestGet(requestHandler){

  wxRequest("GET",requestHandler);
}

function RequestPost(requestHandler){
  wxRequest("POST", requestHandler);
}

module.exports={
  RequestGet: RequestGet,
  RequestPost: RequestPost
}
