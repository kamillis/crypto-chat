angular.module('chatApp', [])
    .controller('ChatController', ['$scope', function($scope) {

        var socket, crypto;

        $scope.chatReady = false;
        $scope.user = '';
        $scope.room = '';

        $scope.message = '';
        $scope.messages = [];

        var scrollToBottom = function() {
            var wrapper = document.getElementById("chat-wrapper");
            wrapper.scrollTop = wrapper.scrollHeight;
        };

        var initChat = function() {
            socket.on('new message', function(message) {
                var decMsg = crypto.decryptMessage(message);
                var msg = decMsg.split('|');
                var cssClass = (msg[1] == $scope.user ? 'my' : 'other');

                $scope.messages.push({
                    date: msg[0],
                    user: msg[1],
                    content: msg[2],
                    cssClass: cssClass
                });

                $scope.$apply();
                scrollToBottom();
            });

            $scope.chatReady = true;
            $scope.$apply();
        };

        var initConnection = function() {
            crypto = new Crypto();

            socket = io({
                path: '/chat'
            });

            socket.on('error', function(message) {
                alert(message);
            });

            // Diffie Hellman key exchange

            socket.on('generator and prime', function(data) {
                if (!$scope.chatReady) {
                    crypto.generateKeys(data.generator, data.prime);
                    socket.emit('client public key', crypto.clientPublicKey);
                }
            });

            socket.on('server public key', function(key) {
                if (!$scope.chatReady) {
                    crypto.saveSessionKey(key);
                    var msg = $scope.user + '|' + $scope.room;
                    var encMsg = crypto.encryptMessage(msg);
                    socket.emit('chat data', encMsg);
                }
            });

            socket.on('chat ready', function() {
                if (!$scope.chatReady) {
                    initChat();
                }
            });
        };

        $scope.joinUser = function() {
            initConnection();
        };

        $scope.sendMessage = function() {
            var msg = $scope.user + '|' + $scope.message;
            var encMsg = crypto.encryptMessage(msg);
            socket.emit('new message', encMsg);
            $scope.message = '';
        };

    }]);