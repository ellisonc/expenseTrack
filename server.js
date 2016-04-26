var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/expenseTrack';
var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function () {
    //these are database schemas, they tell it what to expect
    var userSchema = new mongoose.Schema({
        username: String,
        password: String,
        name: String,
        room: String,
        userID: Number
    });

    var roomSchema = new mongoose.Schema({
        roomName: String,
        password: String,
        users: Array,
        userIDs: Array,
        items: Array
    });

    

    var itemSchema = new mongoose.Schema({
        itemID: Number,
        amount: Number,
        description: String,
        user: String,
        room: String,
        timeStamp: Date
    });

    //these are models based on the schemas
    var User = mongoose.model('User', userSchema);
    var Room = mongoose.model('Room', roomSchema);
    var Item = mongoose.model('Item', itemSchema);
    console.log("initialized");
    

    http.listen(8888);
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/files/app.html');
    });
    app.use(express.static('files'));

    io.on('connection', function (socket) {

        //create a new user in the database
        socket.on('newUser', function (data) {
            console.log(data);
            var userCount;
            User.count({}, function (err, count) {
                userCount = count;
            });
            User.count({ username: data.username }, function (err, count) {
                console.log(count);
                if (count == 0) {
                    console.log(count);
                    console.log("creating new user");
                    var tempUser = new User({
                        username: data.username,
                        password: data.password,
                        name: data.name,
                        room: null,
                        userID: userCount
                    });
                    tempUser.save(function (err, tempUser) {
                        if (err) return console.error(err);
                    });
                    console.log("emit true");
                    socket.emit("createUserResponse", {
                        'success': true,
                        'userID': userCount
                    });
                }
                else {
                    console.log("emit false");
                    socket.emit("createUserResponse", {
                        'success': true,
                    });
                }
            });
        });

        socket.on('newRoom', function (data) {
            Room.count({ roomName: data.roomName }, function (err, count) {
                if (count == 0) {
                    console.log("creating new room");
                    console.log(data);
                    var tempRoom = new Room({
                        roomName: data.roomName,
                        password: data.password,
                        items: data.items,
                        users: data.users,
                        userIDs: data.userIDs
                    });
                    tempRoom.save(function (err, tempRoom) {
                        if (err) return console.error(err);
                    });
                    User.findOne({ 'username': data.username }, function(err, tempUser){
                        if (tempUser == null) {
                            console.log("this shoiuld never happen");
                        }
                        else {
                            tempUser.room = data.roomName;
                            tempUser.save();
                        }
                    });

                    socket.emit("createRoomResponse", true);
                }
                else {
                    socket.emit("createRoomResponse", false);
                }
            });

        });

        socket.on('roomLogin', function (data) {
            Room.findOne({ 'roomName': data.roomName }, function (err, tempRoom) {
                if (tempRoom == null) {
                    socket.emit("roomLoginResponse", {
                        'result': false,
                        'error': "Invalid Room Name"
                    });
                }
                else if (tempRoom.password == data.password) {
                    console.log("login to room successful");

                    console.log(tempRoom.users);

                    tempRoom.users.push(data.username);
                    tempRoom.userIDs.push(data.userID);
                    tempRoom.save();

                    User.findOne({ 'username': data.username }, function (err, doc) {
                        doc.room = tempRoom.roomName;

                        doc.save();
                    });
                    socket.emit("roomLoginResponse", {
                        'result': true,
                        'roomName': tempRoom.roomName,
                        'password': tempRoom.password,
                        'items': tempRoom.items,
                        'users': tempRoom.users
                    });
                }
                else {
                    console.log("room login failed");
                    socket.emit("roomLoginResponse", {
                        'result': false,
                        'error': "Invalid Password"
                    });
                }
            });
        });

        socket.on('getRoomData', function (data) {
            Room.findOne({ "roomName": data.roomName }, function (err, tempRoom) {
                if (tempRoom == null) {
                    console.log("this should never happen");
                }
                else {
                    console.log("returning room data");
                    socket.emit("returnRoomData", {
                        'roomName': tempRoom.roomName,
                        'items': tempRoom.items,
                        'users': tempRoom.users,
                        'userIDs':tempRoom.userIDs
                    });
                }
            });
        });

        //try to login
        socket.on('loginAttempt', function (data) {
            console.log(data);
            User.findOne({ 'username': data.username }, function (err, tempUser) {
                if (tempUser == null) {
                    console.log('null name');
                    socket.emit('loginResponse', {
                        'result': false,
                        'username' : "",
                        'firstname': "",
                        'room' : null
                    });
                }
                else if (tempUser.password == data.password) {
                    console.log('password correct');
                    console.log(tempUser);
                    socket.emit('loginResponse', {
                        'result': true,
                        'username' : tempUser.username,
                        'firstname': tempUser.name,
                        'room': tempUser.room,
                        'userID': tempUser.userID
                    });
                }
                else {
                    console.log('password wrong');
                    console.log(tempUser.password);
                    socket.emit('loginResponse', {
                        'result': false,
                        'username': "",
                        'firstname': "",
                        'room': null
                    });
                }
            });
        });

        socket.on('addItem', function (data) {
            console.log("attemtp to add itme");
            console.log(data);
            Room.findOne({ 'roomName': data.roomName }, function (err, tempRoom) {
                if (tempRoom == null) {
                    console.log("error in adding item");
                }
                else {
                    var tempItem = {
                        'type': data.type,
                        'creatorID': data.creatorID,
                        'cost': data.cost,
                        'date': data.date,
                        'description': data.description
                    }
                    if (tempRoom.items == null) {
                        tempRoom.items = [tempItem];
                    }
                    else {
                        tempRoom.items.push(tempItem);
                    }
                    tempRoom.save();
                    console.log("item saved successfully");
                }
            });
        });

    });
});

mongoose.connect(url);