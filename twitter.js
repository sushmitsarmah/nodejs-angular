var https = require("https");

var options = {
		host:"stream.twitter.com",
		port:"/1/statuses/filter.json?track=bieber",
		method:"GET",
		headers:{
			"Authorization":"Basic"+ new Buffer("username:password").toString("base64")
		}
};

var twitterCollection;
var mongo = require("mongodb");
var host = "127.0.0.1";
var post = mongo.Connection.DEFAULT_PORT;

var db = new mongo.DB("nodejs twitter",new mongo.Server(host,port,{}));
db.open(function(error){
	console.log("db opened");

	db.collection("twitter",function(error,collection){
		twitterCollection = collection;

	});

});


var request = https.request(options,function(response){
		response.on("data",function(chunk){
			var tweet = JSON.parse(chunk);
			twitterCollection.insert(tweet,function(error){
				if(error){
				    console.log(error);
				} else {
				    console.log("inserted successfully");	
				}

			});
	
		});
		response.on("end",function(){
			console.log("disconnected");
		})


});
response.end();
