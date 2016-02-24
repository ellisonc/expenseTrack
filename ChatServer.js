// Require the packages we will use:
var express = require('express'),
	app = express(),
	http = require('http').createServer(app),
	io = require("socket.io").listen(http);


var users = {};
var rooms = {};
var admins = {};
var banned = {};

http.listen(3456);
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/ChatClient.html');
});

io.sockets.on('connection', function(socket){
	function sendUsers(){
		var html = '<b>Users:</b></br>';
		for (var key in users){
			if (users[key].room == socket.room) {
				html += key + '<br/>';
			}
		}
		for (var k in users){
			if (users[k].room == socket.room) {
				users[k].emit('users',html);
			}
		}
	}
	function sendRooms(){
		io.sockets.emit('rooms', Object.keys(rooms));
	}
//listens for sent messages
	socket.on('send', function(data, callback){
		var msg = data.trim();
		if (msg.substr(0,3) == '/p ') {
			msg = msg.substr(3);
			var index = msg.indexOf(' ');
			if (index != -1) {
				var name = msg.substr(0,index);
				msg = msg.substr(index + 1);
				if (name in users) {
					console.log(socket.room);
					if (users[name].room == socket.room) {
						users[name].emit('private', {msg: msg, user: socket.nickname});
						callback('Private message sent: ' + msg);
					}
					else{
						callback('Error, User in another room');
					}
				}
				else{
					callback('Error, enter a valid user!');
				}
			}
			else{
				callback('Error, no message!');
			}
		}
		else if (msg.substr(0,3) == '/k ') { 
			msg = msg.substr(3);
			if (msg.length !== 0) {
				var name = msg;
				if (name in users) {
					if (users[name].room == socket.room) {
						users[name].emit('kick');
						sendUsers();
						callback(name + ' was kicked out of the room');
					}
					else{
						callback('Error, User not in this room');
					}
				}
				else{
					callback('Error, enter a valid user');
				}
			}
			else{
				callback('Error, enter a username');
			}
			//kick user out
		}
		else if (msg.substr(0,3) == '/b ') {
			msg = msg.substr(3);
			if (admins[socket.room] == socket) {
				if (msg.length !== 0) {
					var name = msg;
					if (name in users) {
						banned[name] = socket.room;
						users[name].emit('kick');
						sendUsers();
						callback(name + ' was banned');
					}
					else{
						callback("Error, enter a valid user");
					}
				}
				else{
					callback('Error, enter a username');
				}
			}
			else{
				callback('You do not have permission to ban a user');
			}
		}
		else{
			if (msg.substr(0,7) == 'Google ') {
				msg = msg.substr(7);
				msg = msg.replace(/ /g, "+");
				var temp = 'http://lmgtfy.com/?q=' + msg;
				
				for (var key in users){
					if (users[key].room == socket.room) {
						users[key].emit('newGoog', {msg: temp, user: socket.nickname});
					}
				}
			}else if(msg.substr(0,4) == 'img '){
				msg = msg.substr(4);
				for (var key in users){
					if (users[key].room == socket.room) {
						users[key].emit('newImg', {msg: msg, user: socket.nickname});
					}
				}
			}
			else{
				for (var key in users){
					if (users[key].room == socket.room) {
						users[key].emit('new', {msg: data, user: socket.nickname});
					}
				}
			}
			
			
		}
	});
//listens for new room requests
	socket.on('newRoom', function(data, callback){
		var str = data.name;
		var password = data.pass;
		if (str in rooms) {
			callback(false);
		}
		else{
			callback(true);
			rooms[str] = password;
			socket.room = str;
			admins[str] = socket;
			sendRooms();
			sendUsers();
		}
	});
	
//listens for room selection requests
	socket.on('pickRoom', function(data, callback){
		var str = data.name;
		var password = data.pass;
		if (str in rooms) {
			if (password == rooms[str]) {
				if (banned[socket.nickname] === null) {
					callback(0);
					sendUsers();
				}
				else if (banned[socket.nickname] === str) {
					callback(3);
				}
				else{
					socket.room = data.name;
					callback(0);
					sendUsers();
				}
			}
			else{
				callback(1);
			}
		}
		else{
			callback(2);
		}
	});
//listens for new user requests
	socket.on('newUser', function(data, callback){
		if (data in users) {
			callback(false);
		}
		else{
			callback(true);
			socket.nickname = data;
			users[socket.nickname] = socket;
			sendUsers();
			sendRooms();
		}
	});
//removes user once they exit
	socket.on('disconnect', function(){
		if (!socket.nickname) {
			return;
		}
		else{
			delete users[socket.nickname];
			sendUsers();
		}
	});
	
	socket.on('leave', function(){
		socket.room = null;
	});
});
