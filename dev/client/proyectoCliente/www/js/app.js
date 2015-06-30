// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('login', ['ionic', 'login.controllers', 'login.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('entrar', {
    url: "/entrar",
    templateUrl: "templates/login.html",
    controller: "loginController"

  })

.state('list', {
    url: "/list",
    templateUrl: "templates/logueado.html",
    controller: "myListCtrl"

  })
 
 .state('registrar', {
    url: "/registrar",
    templateUrl: "templates/registrar.html",
    controller: "RegistroController"

  })

 .state('modificar', {
    url: "/modificar",
    templateUrl: "templates/modificar.html",
    controller: "modificarController"

  })

  $urlRouterProvider.otherwise('/entrar');
});