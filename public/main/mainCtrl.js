(function(){
	'use strict';
	angular
		.module('app')
		.controller('mainCtrl', mainCtrl)

	mainCtrl.$inject = ['$scope', '$localStorage', 'socket', '$location', 'ngDialog', '$state'];
	function mainCtrl($scope, $localStorage, socket, $location, ngDialog, $state) {
		
		$scope.room1 = $localStorage.room1;
		$scope.room2 = $localStorage.room2;

		$scope.checkAuth = function(room){
			if(room == 1){
				if($localStorage.room1){
					$state.go('main.room1');
				}
				else{
					$scope.clickToOpen();
				}
			}
			else{
				if($localStorage.room2){
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
	      	controller: ['$scope', '$localStorage', '$state', function($scope, $localStorage, $state){
	      		$scope.room1 = $localStorage.room1;
	      		$scope.room2 = $localStorage.room2;

	      		$scope.joinRoom1 = function(){
	      			$localStorage.room1 = true;
	      			socket.emit('join-room1', {
			          nickname: $localStorage.nickname
			        });
	      			ngDialog.close();
	      			$state.go('main.room1');
	      		}

	      		$scope.joinRoom2 = function(){
	      			$localStorage.room2 = true;
	      			socket.emit('join-room2', {
			          nickname: $localStorage.nickname
			        });
	      			ngDialog.close();
	      			$state.go('main.room2');
	      		}
	      	}]
	      });
	  };
	}
})();