const URL = "api.weixin.qq.com";
const path = '/cgi-bin/token?grant_type=client_credential&appid=wxce6fc7ae094ef31d&secret=42a715c8400e47e1777c1ecba855f3fa';
let http = require('https');
let qs = require('querystring');
let options = {  
    hostname: URL,  
    path: path,  
    method: 'GET',  
    headers: {  
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'  
    }  
}; 

let playMusic = (callback)=>{
	var req = http.request(options, function (serverFeedback) {  
	        if (serverFeedback.statusCode == 200) {  
	            var body = "";  
	            serverFeedback.on('data', function (data) { body += data; })  
	                          .on('end', function () { 
	                          		callback&&callback(body);
	                           });  
	        }  
	        else {  
	            res.send(500, "error");  
	        }  
	    });  

 	
	req.end();  
}


// let crypto = require('crypto'),  //引入加密模块
//     config = require('./config');//引入配置文件
// app.get('/token',function(req,res){
//     //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
//     var signature = req.query.signature,//微信加密签名
//         timestamp = req.query.timestamp,//时间戳
//             nonce = req.query.nonce,//随机数
//           echostr = req.query.echostr;//随机字符串

//     //2.将token、timestamp、nonce三个参数进行字典序排序
//     var array = [config.token,timestamp,nonce];
//     array.sort();

//     //3.将三个参数字符串拼接成一个字符串进行sha1加密
//     var tempStr = array.join('');
//     const hashCode = crypto.createHash('sha1'); //创建加密类型 
//     var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密
//     console.log(signature,timestamp,nonce,echostr);
//     //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
//     if(resultCode === signature){
//         res.send(echostr);
//     }else{
//         res.send('mismatch');
//     }
// });



module.exports = playMusic;