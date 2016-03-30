var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);


http.listen(8888);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/files/app.html');
});

app.use(express.static('files'));


io.on('connection', function (socket) {
    console.log('connected');

    socket.on('addItem', function (item) {
        console.log('addItem: ');
        console.log('type - ' + item.type);
        console.log('creatorID - ' + item.creatorID);
        console.log('date - ' + item.date);
        console.log('description - ' + item.description);
    });

    socket.on('disconnect', function () {
        console.log('disconnected');
    });
});