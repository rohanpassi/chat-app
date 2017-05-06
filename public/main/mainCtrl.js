(function(){
	'use strict';
	angular
		.module('app')
		.controller('mainCtrl', mainCtrl)

	mainCtrl.$inject = ['$scope', '$sessionStorage', 'socket', '$location', 'ngDialog', '$state'];
	function mainCtrl($scope, $sessionStorage, socket, $location, ngDialog, $state) {
		
		$scope.room1 = $sessionStorage.room1;
		$scope.room2 = $sessionStorage.room2;
		$scope.isNavCollapsed = true;
		$scope.isCollapsed = false;

		$scope.checkAuth = function(room){
			if(room == 1){
				if($sessionStorage.room1){
					$state.go('main.room1');
				}
				else{
					$scope.clickToOpen();
				}
			}
			else{
				if($sessionStorage.room2){
					$state.go('main.room2')
				}
				else{
					$scope.clickToOpen();
				}
			}
		}

	  $scope.clickToOpen = function () {
	      ngDialog.open({
	      	template: 'templates/popUp.html',
	      	className: 'ngdialog-theme-default',
	      	showClose: false,
	      	closeByEscape: true,
	      	scope: $scope,
	      	controller: ['$scope', '$sessionStorage', '$state', function($scope, $sessionStorage, $state){
	      		$scope.room1 = $sessionStorage.room1;
	      		$scope.room2 = $sessionStorage.room2;

	      		$scope.joinRoom1 = function(){
	      			$sessionStorage.room1 = true;
	      			socket.emit('join-room1', {
			          nickname: $sessionStorage.nickname
			        });
	      			ngDialog.close();
	      			$state.go('main.room1');
	      		}

	      		$scope.joinRoom2 = function(){
	      			$sessionStorage.room2 = true;
	      			socket.emit('join-room2', {
			          nickname: $sessionStorage.nickname
			        });
	      			ngDialog.close();
	      			$state.go('main.room2');
	      		}
	      	}]
	      });
	  };
	}
})();