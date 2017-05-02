'use strict';

angular
  .module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngStorage',
    'ngDialog'
  ])
  .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/join');

    $stateProvider
    .state('main', {
      abstract: true,
      templateUrl: 'main/main.html',
      controller: 'mainCtrl'
    })
    .state('main.join', {
      url: '/join',
      templateUrl: 'join/join.html',
      controller: 'joinCtrl',
    })
    .state('main.room1', {
      url: '/room1',
      templateUrl: 'room1/room1.html',
      controller: 'room1Ctrl'
    })
    .state('main.room2', {
      url: '/room2',
      templateUrl: 'room2/room2.html',
      controller: 'room2Ctrl'
    })
    .state('main.access404', {
      url: '/error',
      templateUrl: 'templates/404.html'
    })
    .state('main.about', {
      url: '/about',
      templateUrl: 'templates/about.html'
    });
  }]);