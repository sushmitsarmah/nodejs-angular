var fs = require("fs");
var express = require("express");
var http = require("http");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var query = require("./mongo_query.js");
var insert = require("./mongo_insert.js");

var users = [{"id":1,"name":"harry"},{"id":2,"name":"rock"}];

for(var i=0;i<users.length;i++){
	insert.addUser(users[i]);
}

var app = express();

app.use(app.router);
app.use(express.static(__dirname));
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').renderFile);

app.get("/",function(request,response){
	response.render("index.html");
});

app.get("/hello/:text",function(request,response){
	response.send("hello"+request.params.text);
});


app.get("/user/:id",function(request,response){
	query.getUser(request.params.id, function(user){ // users[request.params.id];
	    if(!user){	
		response.send("no user given",404);
	    } else {
	        //response.send("hello"+user.name);
	        response.send(user);
	    }
	});
});


app.listen(port,host, function(){
	console.log("listening "+host+":"+port);
});


