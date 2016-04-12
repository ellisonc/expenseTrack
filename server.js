var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/expenseTrack';

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected to db");

    http.listen(8888);
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/files/app.html');
    });

    app.use(express.static('files'));
    

    io.on('connection', function (socket) {

        socket.on('addItem', function (item) {
            console.log('addItem: ');
            console.log('type - ' + item.type);
            console.log('creatorID - ' + item.creatorID);
            console.log('date - ' + item.date);
            console.log('description - ' + item.description);
        });

        socket.on('delete', function (target) {
            console.log('target: ');
            console.log(target);
        });

        socket.on('newUser', function (userName) {
            console.log('newUser: ');
            console.log(userName);
        });

        socket.on('disconnect', function () {
            console.log('disconnected');
        });
    });



    db.close();
});

