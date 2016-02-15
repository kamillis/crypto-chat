var socketIO = require('socket.io');
var Crypto = require('./utils/crypto');

module.exports = function(app, server) {

    var crypto = new Crypto();

    var io = socketIO(server, {
        path: '/chat'
    });

    io.use(function(socket, next) {
        var data = socket.handshake.query.data;
        data = crypto.rsaDecrypt(data);
        data = data.split('|');
        if (data.length == 2) {
            socket.user = data[0];
            socket.room = data[1];
            return next();
        } else {
            return next(new Error("Wrong request."));
        }
    });

    io.on('connection', function(socket) {

        // Join socket to room
        socket.join(socket.room);

        // Listen to new messages
        socket.on('new message', function(message) {
            var msg = Date.now() + '|' + message;
            io.to(socket.room).emit('new message', msg);
        });

    });

};