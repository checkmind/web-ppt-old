const database = require('./routes/myMongoose');
/*登陆跳转*/
var AppID = 'wxce6fc7ae094ef31d';
var AppSecret = '42a715c8400e47e1777c1ecba855f3fa';
var express = require('express');
var router = express.Router();
var request = require('request');
router.get('/wx_login', function(req,res, next){
    //console.log("oauth - login")

    // 第一步：用户同意授权，获取code
    let router = 'defend';
    // 这是编码后的地址
    var return_uri = 'http%3a%2f%2fganjz.cn%2f'+router;  
    var scope = 'snsapi_userinfo';

    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');

});
router.get('/clickFn', function(req,res, next){
   database.clickFn();
});
//localhost/saveScore?score=49&openid=22323
router.get('/saveScore',function(req,res,next){
    let score = req.query.score;
    let openid = req.query.openid;
    database.saveUserScoreInf(function(message){
        res.send(message);
    },openid,score);
})
router.get('/sortScore',function(req,res,next){
    let score = req.query.score;
    let openid = req.query.openid;
    database.sortUsersScore(people=>{
        res.send(people);
    });
})
//localhost/saveUser?nickname=234&headimgurl=2323&openid=22323
router.get('/saveUser',function(req,res,next){
    let nickname = req.query.nickname;
    let headimgurl = req.query.headimgurl;
    let openid = req.query.openid;
    database.saveUserInf(function(inf){
                                res.send(inf);
                            },nickname,headimgurl,openid);
})
router.get('/get_wx_access_token', function(req,res, next){
    //console.log("get_wx_access_token")
    //console.log("code_return: "+req.query.code)
   
    // 第二步：通过code换取网页授权access_token
    var code = req.query.code;
    request.get(
        {   
            url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
        },
        function(error, response, body){
            if(response.statusCode == 200){

                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                //console.log(JSON.parse(body));
                var data = JSON.parse(body);
                var access_token = data.access_token;
                var openid = data.openid;

                request.get(
                    {
                        url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                    },
                    function(error, response, body){
                        if(response.statusCode == 200){

                            // 第四步：根据获取的用户信息进行对应操作
                            var userinfo = JSON.parse(body);
                            //console.log(JSON.parse(body));
                            console.log('获取微信信息成功！');

                            // 小测试，实际应用中，可以由此创建一个帐户
                            // res.send("\
                            //     <h1>"+userinfo.nickname+" 的个人信息</h1>\
                            //     <p><img src='"+userinfo.headimgurl+"' /></p>\
                            //     <p>openid"+openid+"</p>\
                            //     <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                            // ");
                            database.saveUserInf(function(inf){
                                res.send(inf);
                            },userinfo.nickname,userinfo.headimgurl,openid);

                        }else{
                            console.log(response.statusCode);
                        }
                    }
                );
            }else{
                console.log(response.statusCode);
            }
        }
    );
});
module.exports=router;