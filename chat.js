var socketIO = require('socket.io');
var Crypto = require('./utils/crypto');
var Users = require('./utils/users');

module.exports = function(app, server) {

    var crypto = new Crypto();
    var users = new Users();

    var io = socketIO(server, {
        path: '/chat'
    });

    io.on('connection', function(socket) {

        var chatReady = false;
        var sessionKey;

        var emitUsersList = function(room) {
            var conUsers = users.getUsersList(room).join('|');
            for (var k in users.storage[room]) {
                if (users.storage[room].hasOwnProperty(k)) {
                    var user = users.storage[room][k];
                    var encMsg = crypto.encryptMessage(conUsers, user.key);
                    user.socket.emit('users changed', encMsg);
                }
            }
        };

        var initChat = function(user, room) {
            users.addUser(room, user, socket, sessionKey);

            // Join socket to room
            socket.join(room);

            // Emit current users list
            emitUsersList(room);

            // Listen to new messages
            socket.on('new message', function(message) {
                var decMsg = crypto.decryptMessage(message, sessionKey);
                var msg = Date.now() + '|' + decMsg;
                for (var k in users.storage[room]) {
                    if (users.storage[room].hasOwnProperty(k)) {
                        var user = users.storage[room][k];
                        var encMsg = crypto.encryptMessage(msg, user.key);
                        user.socket.emit('new message', encMsg);
                    }
                }
            });

            // Socket disconnect
            socket.on('disconnect', function() {
                users.deleteUser(room, user);
                emitUsersList(room);
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
                var serverKeys = crypto.generateKeys();
                sessionKey = crypto.getSessionKey(key, serverKeys.priKey);
                socket.emit('server public key', serverKeys.pubKey);
            }
        });

        socket.on('chat data', function(message) {
            if (!chatReady) {
                var decData = crypto.decryptMessage(message, sessionKey);
                var data = decData.split('|');
                if (users.userExists(data[1], data[0])) {
                    socket.emit('user exists');
                } else {
                    initChat(data[0], data[1]);
                    socket.emit('chat ready');
                }
            }
        });

    });

};