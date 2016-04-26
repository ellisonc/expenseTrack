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
    });

    var roomSchema = new mongoose.Schema({
        roomName: String,
        password: String,
        users: Array,
        Items: Array
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
            console.log("creating new user");
            console.log(data);
            //User is a db "model", temp user is an instance of it.
            var tempUser = new User({
                username: data.username,
                password: data.password,
                name: data.name,
                room: null
            });
            //database command
            tempUser.save(function (err, tempUser) {
                if (err) return console.error(err);
            });
        });

        socket.on('checkNewUser', function (data) {
            User.count({ username: data.username }, function (err, count) {
                console.log("checking new user");
                console.log(count);
            });
        });

        //check username availability
        socket.on('check', function (userName) {
            //this counts how many users in User have this username
            User.count({ username: userName }, function (err, count) {
                console.log(count);
                if (count == 0) {
                    socket.emit("checkReturn", false);
                }
                else {
                    socket.emit("checkReturn", true);
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
                        'rooms' : null
                    });
                }
                else if (tempUser.password == data.password) {
                    console.log('password correct');
                    console.log(tempUser.password);
                    socket.emit('loginResponse', {
                        'result': true,
                        'username' : tempUser.username,
                        'firstname': tempUser.name,
                        'rooms' : tempUser.rooms
                    });
                }
                else {
                    console.log('password wrong');
                    console.log(tempUser.password);
                    socket.emit('loginResponse', {
                        'result': false,
                        'username': "",
                        'firstname': "",
                        'rooms': null
                    });
                }
            });
        });


    });
});

mongoose.connect(url);