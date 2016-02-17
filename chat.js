var socketIO = require('socket.io');
var Crypto = require('./utils/crypto');

module.exports = function(app, server) {

    var io = socketIO(server, {
        path: '/chat'
    });

    io.on('connection', function(socket) {

        var chatReady = false;
        var crypto = new Crypto();

        var initChat = function(user, room) {

            // Join socket to room
            socket.join(room);

            // Listen to new messages
            socket.on('new message', function(message) {
                var decMsg = crypto.decryptMessage(message);
                var msg = Date.now() + '|' + decMsg;
                var encMsg = crypto.encryptMessage(msg);
                io.to(room).emit('new message', encMsg);
            });

            chatReady = true;
        };

        // Diffie Hellman key exchange

        socket.emit('generator and prime', {
            generator: crypto.generator,
            prime: crypto.prime
        });

        socket.on('client public key', function(key) {
            if (!chatReady) {
                crypto.generateKeys();
                crypto.saveSessionKey(key);
                socket.emit('server public key', crypto.serverPublicKey);
            }
        });

        socket.on('chat data', function(message) {
            if (!chatReady) {
                var decData = crypto.decryptMessage(message);
                var data = decData.split('|');
                initChat(data[0], data[1]);
                socket.emit('chat ready');
            }
        });

    });

};