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

    if($scope.room2 == false){
      socket.emit('join-room2', {
        nickname: nickname
      });
      $scope.room2 = true;
      $sessionStorage.room2 = true;
    }

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