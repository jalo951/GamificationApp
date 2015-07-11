angular.module('login.services', [])
    .factory('API', function($rootScope, $http, $ionicLoading, $window, $ionicHistory,$state, $ionicSideMenuDelegate) {
        var base = "http://localhost:9804";

        $rootScope.show = function(text) {
            $rootScope.loading = $ionicLoading.show({
                template: '<p class="item-icon-left">' + text + '<ion-spinner class= "spinner-energized" icon="crescent"/></p>',
                duration: 2000
            });
        };


        $rootScope.hide = function() {
            $ionicLoading.hide();
        };

        $rootScope.notify = function(text) {
            $rootScope.show(text);
            $window.setTimeout(function() {
                $rootScope.hide();
            }, 1999);
        };

        $rootScope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $rootScope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $rootScope.goTo = function(estado) {
            $state.go(estado);
        };

        /*
        $rootScope.goHome = function() {
            $window.location.href = '#/list';
        };
        */

        $rootScope.logout = function() {
            $rootScope.setToken("");
            $window.location.href = '#/entrar';
        };

        $rootScope.setToken = function(token) {
            return $window.localStorage.token = token;
        }

        $rootScope.getToken = function() {
            return $window.localStorage.token;
        }

        $rootScope.passwordToken = function(pToken) {
            return $window.localStorage.passwordToken = pToken;
        }

        $rootScope.isSessionActive = function() {
            return $window.localStorage.token ? true : false;
        }

        return {
            signin: function(form) {
                return $http.post(base + '/login', form);
            },
            getAll: function(id) {
                /*alert(id);
                return $http.get(base + '/list', {
                    method: 'GET',
                    params: {
                        token: id
                    }
                });*/
                return $http.get(base + '/preguntas', {
                    method: 'GET',
                    params: {
                        token: id
                    }
                });

            },

            nuevoReto: function(id) {
                return $http.get(base + '/nuevoReto', {
                    method: 'GET',
                    params: {
                        token: id
                    }
                });
            },

            verificarPregunta: function(token) {

                return $http.get(base + '/verificarPregunta', {
                    method: 'GET',
                    params: {
                        token: token
                    }
                });
            },
            resetPassword: function(form) {
                return $http.post(base + '/resetPassword', form);
            },
            registrar: function(form) {
                return $http.post(base + '/registrar', form);
            },

            modificarDatos: function(form, id) {
                return $http.put(base + '/modificarDatos', form, {
                    method: 'PUT',
                    params: {
                        token: id
                    }
                });
            },

            modificarContrasena: function(form, id) {
                return $http.put(base + '/modificarContrasena', form, {
                    method: 'PUT',
                    params: {
                        token: id
                    }
                });
            },

            mostrarInfo: function(id) {
                return $http.get(base + '/infoUser', {
                    method: 'GET',
                    params: {
                        token: id
                    }
                });
            },

            newPassword: function(form) {
                return $http.post(base + '/newPassword', form);
            },

            buscarCodigo: function(form) {
                return $http.post(base + '/codigo', form);
            },

            anadirPregunta: function(form, token) {
                return $http.post(base + '/anadirPregunta', form, {
                    method: 'POST',
                    params: {
                        token: token
                    }
                });
            },
            unirseProblema: function(form, token) {
                console.log("entré a service");
                return $http.post(base + '/unirseProblema', form, {
                    method: 'POST',
                    params: {
                        token: token
                    }
                });
            }
        }
    });
