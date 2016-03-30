var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);

var users = {};

http.listen(8888);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/files/app.html');
});

app.use(express.static('files'));


io.on('connection', function (socket) {
    socket.on('addItem', function (type, creatorID, date, description) {
        console.log('addItem: ');
        console.log('type - ' + type);
        console.log('creatorID - ' + creatorID);
        console.log('date - ' + date);
        console.log('description - ' + description);
    });
});