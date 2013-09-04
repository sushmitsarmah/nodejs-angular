var mongo = require("mongodb");
var dbhost = "127.0.0.1";
var dbport = mongo.Connection.DEFAULT_PORT;

function getUser(id,callback){
    var db = new mongo.Db("nodejsExample",new mongo.Server(dbhost,dbport,{}));

    db.open(function(error){
	console.log("connected");
	console.log(id);
	db.collection("User",function(error,collection){
		collection.find({"id":id.toString()},function(error,cursor){
			cursor.toArray(function(error,users){
				if(users.length == 0){
					callback(false);
				} else {
					callback(users[0]);
				}
			});
		});
	});
    });
}

module.exports.getUser = getUser;
