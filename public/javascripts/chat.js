angular.module('chatApp', [])
    .controller('ChatController', ['$scope', function($scope) {

        $scope.message = '';
        $scope.messages = [];

        var scrollToBottom = function() {
            var wrapper = document.getElementById("chat-wrapper");
            wrapper.scrollTop = wrapper.scrollHeight;
        };

        var socket = io({
            path: '/chat',
            query: 'user=' + encodeURIComponent(user)
                + '&room=' + encodeURIComponent(room)
        });

        socket.on('new message', function(message) {
            var msg = message.split('|');
            var cssClass = (msg[1] == user ? 'my' : 'other');

            $scope.messages.push({
                date: msg[0],
                user: msg[1],
                content: msg[2],
                cssClass: cssClass
            });

            $scope.$apply();
            scrollToBottom();
        });

        socket.on('error', function(message) {
            alert(message);
        });

        $scope.sendMessage = function() {
            var msg = user + '|' + $scope.message;
            socket.emit('new message', msg);
            $scope.message = '';
        };

    }]);