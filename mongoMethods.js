let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/weixin', { server: { reconnectTries: 10 } });
let db = mongoose.connection;

let Schema = mongoose.Schema;

let weixin = new Schema({
	nickname :  { type : String ,required :  true, unique:true },
	headimgurl :  { type : String ,required :  true,unique:false },
	openid : {type:String ,required :  true,unique:false },
	score : {type:String ,required :  true,unique:false }
})


weixin = mongoose.model('sort',weixin);


db.on('error',function(err , docs){
	console.log(err);
})

let saveUserInf = (callback,nickname,headimgurl,openid,score)=>{
	let node = new weixin({
		nickname : nickname,
		headimgurl : headimgurl,
		openid : openid,
		score : 0
	});
	node.save(err=>{
		if(err)
			console.log(err);
		callback&&callback();
	});
}
let saveUserScoreInf = (openid,score)=>{
	weixin.findOne({openid:openid},function(err,humbue){
		if(humbue){
			humbue.score=score;
		}
		humbue.save(function(err){
			if(err)
				console.log(err);

		});
		console.log('save user score');
	});
}
let sortUsersScore = (callback)=>{
		weixin.find({}).sort('score').limit(10).exec((err, people) => {
				 
			if (err) {
				console.log(err);
			} else {
				callback&&callback(people);
			}
		});
}
module.exports = {
	saveUserScoreInf : saveUserScoreInf,
	saveUserInf : saveUserInf,
	sortUsersScore : sortUsersScore
};





 