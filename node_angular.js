var fs = require("fs");
var io = require("sockets.io");
var express = require("express");
var mongo = require("mongodb");
var https = require("https");
var config = fs.readFileSync("config.json");
var host = config.host;
var port = config.port;
var dbport = mongo.Connection.DEFAULT_PORT;

var TwitterCollection;
var AngularCollection;

var options = {
	host:"stream.twitter.com",
	path:"/1/statuses/filter.json?track=bieber",
	headers:{
	    "Authorization":"Basic"+new Buffer("username:password").toString("base64")
	}
};

var db = new mongo.db("node_angular", new mongo.Server(host,port,{}));

db.open(function(error){
    db.collection("users",function(error,collection){
	AngularCollection = collection;
    });

    db.collection("tweets",function(error,collection){
	TwitterCollection = collection;
    });
});

var request = https.request(options, function(response){
	request.on("data",function(chunk){
	    var tweet = JSON.parse(chunk);
	    io.sockets.emit("tweet",tweet);
	    TwitterCollection.insert(tweet,function(error){
		if(error){
		    console.log("insertion failed");
		} else {
		    console.log("successfully inserted");
		}
	    });
	});
	request.on("end",function(){
	    console.log("connection lost or ended");
	});
});
request.end();

var app = express();

app.use(app.router);

app.use(express.static(__dirname+"public"));

app.get("/",function(request,response){
    var content = fs.readFile("index.html");
    response.setHeader({"Content-Type":"text/html"});
    response.send(content);
});

app.get("/users/:id",function(request,response){
    AngularCollection.find({"id":request.params.id},function(error,cursor){
	response.send(cursor);
    });
});

app.get("/tweets/:username",function(request,response){
    TwitterCollection.find({"name":request.params.username},function(error,cursor){
	response.send(cursor);
    });
});

app.listen(host,port,function(){
    console.log("Listening: "+host+" : "+port);
});


