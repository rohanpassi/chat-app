(function() {
  'use strict';

  angular
    .module('app')
    .controller('room1Ctrl', room1Ctrl);

  room1Ctrl.$inject = ['$scope', '$sessionStorage', 'socket'];

  function room1Ctrl($scope, $sessionStorage, socket) {
  	$scope.room1Message = "";
  	$scope.room1Messages = [];
  	$scope.room1users = [];
    var nickname;
  	
    if($sessionStorage.nickname){
      $scope.myNickName = $sessionStorage.nickname;
      nickname = $scope.myNickName;
    }

    if(($scope.myNickName == "") || ($scope.myNickName == undefined)){
      socket.emit('get-username');
      socket.on('username', function(data){
        nickname = data;
        $scope.myNickName = nickname;
        $sessionStorage.nickname = nickname;
      });
    }

    $scope.room1 = $sessionStorage.room1;
    $scope.room2 = $sessionStorage.room2;

    if($scope.room1 == false){
      socket.emit('join-room1', {
        nickname: nickname
      });
      $scope.room1 = true;
      $sessionStorage.room1 = true;
    }


    socket.emit('get-users-room1');
    socket.on('users-room1', function(data){
      console.log("Users in room 1: ", data);
      $scope.room1users = data.filter(function(item){
        return item.nickname !== nickname;
      });
    });

  	socket.emit('get-room1-messages');
    socket.on('room1-messages', function(data){
      console.log("Messages in room 1: ", data);
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