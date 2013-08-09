var fs = require("fs");
var express = require("express");
var http = require("http");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;

var insert = require("./mongo_insert.js");
var query = require("./mongo_query.js");

var app = express();

app.use(app.router);
app.use(express.static(__dirname));

app.get("/",function(request,response){
	response.send("hello");
});

app.get("/hello/:text",function(request,response){
	response.send("hello"+request.params.text);
});

var users = {"1":"harry","2":"rock"};

app.get("/user/:id",function(request,response){
	query(request.params.id, function(user){ // users[request.params.id];
	    if(!user){	
		response.send("no user given",404);
	    } else {
	        response.send("hello"+user.name);
	    }
	});
});


app.listen(port,host, function(){
	console.log("listening "+host+":"+port);
});


