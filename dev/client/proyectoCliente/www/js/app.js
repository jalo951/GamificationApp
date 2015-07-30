angular.module('login', ['ionic', 'login.controllers', 'login.services', 'login.directives'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
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
                controller: "primerNivelController"
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

    .state('app.trabajoFinal', {
        url: "/trabajoFinal",
        views: {
            'menuContent': {
                templateUrl: "templates/trabajoFinal.html",
                controller: "trabajoFinalController"
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
                controller: "segundoNivelController"
            }
        }
    })

    .state('app.tercerNivel', {
        url: "/tercerNivel",
        views: {
            "menuContent": {
                templateUrl: "templates/tercerNivel.html",
                controller: "tercerNivelController"
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

    .state('error', {
        url: "/error",
        templateUrl: "templates/error.html"
    })

    .state('app.acerca', {
        url: "/acerca",
        views: {
            "menuContent": {
                templateUrl: "templates/acerca.html",
                controller: "homeController"
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
