(function() {
  'use strict';

  angular
    .module('app')
    .controller('joinCtrl', joinCtrl);

  joinCtrl.$inject = ['$state', '$scope', '$localStorage', 'socket'];

  function joinCtrl($state, $scope, $localStorage, socket) {
  	$scope.name = "";
  	var nickname;
    $localStorage.room1 = false;
    $localStorage.room2 = false;
    $scope.isAuth = false;
    $scope.room1 = false;
    $scope.room2 = false;
    $scope.users = [];

    socket.emit('get-all-users');
    socket.on('all-users', function(data){
      $scope.users = data;
    });

    $scope.checkUnique = function(){
      for(var i=0; i < $scope.users.length; i++){
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
  		$localStorage.nickname = $scope.name;

  		if($scope.room1){
        socket.emit('join-room1', {
          nickname: nickname
        });
        $localStorage.room1 = true;
        $state.go('main.room1');
      }
      if($scope.room2){
        socket.emit('join-room2', {
          nickname: nickname
        });
        $localStorage.room2 = true;
        $state.go('main.room2');
      }
  	}

  }
})();