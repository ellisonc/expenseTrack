var http = require("http"),
url = require('url'),
path = require('path'),
mime = require('mime'),
fs = require('fs');

function sendFile(error, data){
	if(err){
		response.writeHead(404, {"Content-Type" : "text/plain"});
		response.write("Internal server error: could not read file");
		response.end();
		return;
	}
	
	var mimetype = mime.lookup(filename);
	response.writeHead(200,{"Content-Type" : mimetype});
	response.write(data);
	response.end();
	return;
}

function serve(request, response){
	var filename = "app.html";
	fs.readFile(filename, sendFile);
}

var server = http.createServer(serve);
server.listen(8888);