var mongo = require("mongodb");
var dbhost = "127.0.0.1";
var dbport = mongo.Connection.DEFAULT_PORT;

function addUser(user){
   
   db = new mongo.Db("nodejsExample",new mongo.Server(dbhost,dbport,{}));
   db.open(function(error){
	console.log("connected");

	db.collection("User",function(error,collection){
		console.log("got the collection");
		console.log(user.id);

		collection.insert({
			id:user.id.toString(),
			name:user.name.toString()	
		}, function(){
			console.log(user.name + " inserted");
		});
	});

   });
}

module.exports.addUser = addUser;


