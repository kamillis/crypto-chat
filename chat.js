var socketIO = require('socket.io');

module.exports = function(server) {

    var io = socketIO(server, {
        path: '/chat'
    });

    io.use(function(socket, next) {
        var user = socket.handshake.query.user;
        var room = socket.handshake.query.room;
        if (user && room) {
            socket.user = user;
            socket.room = room;
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