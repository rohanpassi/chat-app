(function() {
  'use strict';

  angular
    .module('app')
    .controller('joinCtrl', joinCtrl);

  joinCtrl.$inject = ['$state', '$scope', 'socket', '$sessionStorage'];

  function joinCtrl($state, $scope, socket, $sessionStorage) {
  	$scope.name = "";
  	var nickname;
    $sessionStorage.room1 = false;
    $sessionStorage.room2 = false;
    $scope.isAuth = false;
    $scope.room1 = false;
    $scope.room2 = false;
    $scope.users = [];

    socket.emit('get-all-users');
    socket.on('all-users', function(data){
      $scope.users = data;
      console.log("Chat Users: ", $scope.users);
    });

    $scope.checkUnique = function(){
      for(var i=0; i < $scope.users.length; i++){
        // socket.emit('get-all-users');
        if($scope.users[i].nickname == $scope.name){
          $scope.userForm.username.$setValidity("text", false);
          $scope.userForm.username.errorMessage = "Username already exists! Please enter another username"
          break;
        }
        else{
          $scope.userForm.username.$setValidity("text", true);
        }
      }
    }

  	$scope.join = function(){
      $scope.isAuth = true;
  		nickname = $scope.name;
  		$sessionStorage.nickname = $scope.name;

  		if($scope.room1){
        if(nickname == ""){
          nickname = "Anonymous User";
        }
        socket.emit('join-room1', {
          nickname: nickname
        });
        $sessionStorage.room1 = true;
        $state.go('main.room1');
      }
      if($scope.room2){
        if(nickname == ""){
          nickname = "Anonymous User";
        }
        socket.emit('join-room2', {
          nickname: nickname
        });
        $sessionStorage.room2 = true;
        $state.go('main.room2');
      }
  	}

  }
})();