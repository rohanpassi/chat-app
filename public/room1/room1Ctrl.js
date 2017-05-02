(function() {
  'use strict';

  angular
    .module('app')
    .controller('room1Ctrl', room1Ctrl);

  room1Ctrl.$inject = ['$scope', '$localStorage', 'socket'];

  function room1Ctrl($scope, $localStorage, socket) {
  	$scope.room1Message = "";
  	$scope.room1Messages = [];
  	$scope.room1users = [];
  	$scope.myNickName = $localStorage.nickname;
    $scope.room1 = $localStorage.room1;
    $scope.room2 = $localStorage.room2;
    $scope.id = "";
  	var nickname = $scope.myNickName;

    socket.emit('get-users-room1');
    socket.on('users-room1', function(data){
      console.log(data);
      $scope.room1users = data.filter(function(item){
        return item.nickname !== nickname;
      });
    });

  	socket.emit('get-room1-messages');
    socket.on('room1-messages', function(data){
      console.log(data);
      $scope.room1Messages = data;
    });

  	socket.on('message-received-room1', function(data){
  		$scope.room1Messages.unshift(data);
  	});

  	$scope.sendMessage = function(data){
  		var newMessage = {
  			message: $scope.room1Message,
  			from: $scope.myNickName,
        timestamp: (new Date()).getTime()
  		}

  		socket.emit('send-message-room1', newMessage);
  		$scope.room1Message = "";
  		$scope.room1Messages.unshift(newMessage);
      console.log($scope.room1Messages);
  	}
  };
})();