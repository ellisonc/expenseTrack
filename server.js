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
    var userSchema = new mongoose.Schema({
        username: String,
        password: String,
        name: String,
        rooms: Array
    });

    var roomSchema = new mongoose.Schema({
        roomID: String,
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

    var User = mongoose.model('User', userSchema);
    var Room = mongoose.model('Room', roomSchema);
    var Item = mongoose.model('Item', itemSchema);
});

mongoose.connect(url);
http.listen(8888);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/files/app.html');
});
app.use(express.static('files'));

io.on('connection', function (socket) {

    socket.on('newUser', function (data) {
        var tempUser = new User({
            username: data.username,
            password: data.password,
            name: data.name,
            rooms: null
        });
        tempUser.save(function (err, tempUser) {
            if (err) return console.error(err);
        });
    });

    socket.on('check', function (username, fn) {
        User.count({ username: username }, function (err, count) {
            if (count == 0) {
                fn(false);
            }
            else {
                fn(true);
            }
        });
    });
});

//MongoClient.connect(url, function (err, db) {
//    assert.equal(null, err);
//    console.log("Connected to db");
//    http.listen(8888);
//    app.get('/', function (req, res) {
//        res.sendFile(__dirname + '/files/app.html');
//    });

//    app.use(express.static('files'));
    

//    io.on('connection', function (socket) {
//        socket.on('check', function (userName, fn) {
//            console.log('checking ' + userName);            
//            //query mongodb
//            var cursor = db.collection('users').find({ "username": userName });
//            cursor.count(function (err, count) {
//                console.log(count);
//                if (count != 0) {
//                    fn(true);
//                }
//                else {
//                    fn(false);
//                }
//            });
//        });

//        socket.on('addItem', function (item) {
//            console.log('addItem: ');
//            console.log('type - ' + item.type);
//            console.log('creatorID - ' + item.creatorID);
//            console.log('date - ' + item.date);
//            console.log('description - ' + item.description);
//        });

//        socket.on('delete', function (target) {
//            console.log('target: ');
//            console.log(target);
//        });

//        socket.on('newUser', function (userName) {
//            //db.users.insert({UserName: userName})
//        });

//        socket.on('disconnect', function () {
//            console.log('disconnected');
//        });
//    });



//    db.close();
//});

