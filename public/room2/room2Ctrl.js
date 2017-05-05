(function() {
  'use strict';

  angular
    .module('app')
    .controller('room2Ctrl', room2Ctrl);

  room2Ctrl.$inject = ['$scope', '$sessionStorage', 'socket'];

  function room2Ctrl($scope, $sessionStorage, socket) {
  	$scope.room2Message = "";
  	$scope.room2Messages = [];
  	$scope.room2users = [];
  	$scope.myNickName = $sessionStorage.nickname;
    $scope.room1 = $sessionStorage.room1;
    $scope.room2 = $sessionStorage.room2;
  	var nickname = $scope.myNickName;

  	socket.emit('get-users-room2');
  	socket.on('users-room2', function(data){
  		console.log("Users in room 2: ", data);
  		$scope.room2users = data.filter(function(item){
  			return item.nickname !== nickname;
  		});
  	});

    socket.emit('get-room2-messages');
    socket.on('room2-messages', function(data){
      console.log("Messages in room 2: ", data);
      $scope.room2Messages = data;
    });

  	socket.on('message-received-room2', function(data){
  		$scope.room2Messages.unshift(data);
  	});

  	$scope.sendMessage = function(data){
  		var newMessage = {
  			message: $scope.room2Message,
  			from: $scope.myNickName,
        timestamp: (new Date()).getTime()
  		}

  		socket.emit('send-message-room2', newMessage);
  		$scope.room2Message = "";
  		$scope.room2Messages.unshift(newMessage);
      console.log($scope.room2Messages);
  	}
  };
})();