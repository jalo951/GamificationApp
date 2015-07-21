// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('login', ['ionic', 'login.controllers', 'login.services', 'login.directives'])

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

        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
    })

    .state('entrar', {
        url: "/entrar",
        templateUrl: "templates/login.html",
        controller: "loginController"
    })

    .state('subir', {
        url: "/subir",
        templateUrl: "templates/menusubir.html",
        controller: "uploadController"
    })

    .state('resetPassword', {
        url: "/resetPassword",
        templateUrl: "templates/resetPassword.html",
        controller: "resetController"

    })

    .state('app.primerNivel', {
        url: "/primerNivel",
        views: {
            'menuContent': {
                templateUrl: "templates/primerNivel.html",
                controller: "mapController"
            }
        }

    })

    .state('app.preguntas', {
        url: "/preguntas",
        views: {
            'menuContent': {
                templateUrl: "templates/preguntas.html",
                controller: "preguntasController"
            }
        }

    })


    .state('registrar', {
        url: "/registrar",
        templateUrl: "templates/registrar.html",
        controller: "RegistroController"
    })

    .state('app.modificar', {
        url: "/modificar",
        views: {
            "menuContent": {
                templateUrl: "templates/modificar.html",
                controller: "modificarController"
            }
        }

    })

    .state('newPassword', {
        url: "/newPassword",
        templateUrl: "templates/newPassword.html",
        controller: "newPassController"

    })

    .state('insertarCodigo', {
        url: "/insertarCodigo",
        templateUrl: "templates/insertarCodigo.html",
        controller: "newPassController"

    })

    .state('app.ranking', {
        url: "/ranking",
        views: {
            "menuContent": {
                templateUrl: "templates/ranking.html",
                controller: "rankingController"
            }
        }
    })

    .state('app.segundoNivel', {
        url: "/segundoNivel",
        views: {
            "menuContent": {
                templateUrl: "templates/segundoNivel.html",
                controller: "mapController"
            }
        }
    })

     .state('app.tercerNivel', {
        url: "/tercerNivel",
        views: {
            "menuContent": {
                templateUrl: "templates/tercerNivel.html",
                controller: "mapController"
            }
        }
    })

    .state('app.objetivos', {
        url: "/objetivos",
        views: {
            "menuContent": {
                templateUrl: "templates/objetivos.html",
                controller: "objetivosController"
            }
        }

    })

    .state('app.perfil', {
        url: "/perfil",
        views: {
            "menuContent": {
                templateUrl: "templates/perfil.html",
                controller: "perfilController"
            }
        }
    })

    .state('home', {
        url: "/home",
        templateUrl: "templates/home.html",
        controller: "homeController"
    })

    $urlRouterProvider.otherwise('/entrar');
});
