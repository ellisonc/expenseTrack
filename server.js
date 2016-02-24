var http = require("http");

function serve(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World");
	response.end();
}

var server = http.createServer(serve);
server.listen(8888);