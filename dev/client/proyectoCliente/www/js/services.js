angular.module('login.services', [])
    .factory('API', function($rootScope, $http, $ionicLoading, $window, $ionicHistory, $state, $ionicSideMenuDelegate) {
        var base = "https://gamificationapp.herokuapp.com/";

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
            $window.location.reload();
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

            verRanking: function(id) {
                return $http.get(base + '/verRanking', {
                    method: 'GET',
                    params: {
                        token: id
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

            anadirImagen: function(data, token) {
                return $http.post(base + '/anadirImagen', data, {
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
            },

            verObjetivos: function(token) {
                return $http.get(base + '/verObjetivos', {
                    method: 'GET',
                    params: {
                        token: token
                    }
                });
            },

            votarObjetivo: function(token, form) {
                return $http.post(base + '/votarObjetivo', form, {
                    method: 'POST',
                    params: {
                        token: token
                    }
                });
            },


            eliminarPreguntas: function() {
                return $http.get(base + '/eliminarPreguntas');
            },

            cambiarNivel: function(idPregunta){
                return $http.get(base + '/cambiarNivel', {
                    method: 'GET',
                    params: {
                        _id: idPregunta
                    }
                });
            },

            nuevoObjetivo: function(form,token){
                return $http.post(base + '/nuevoObjetivo',form,{
                    method: 'POST',
                    params: {
                        token: token
                    }
                });
            }, 

            verificarVotacion: function(token, objetivo_id){
                return $http.get(base + '/verificarVotacion', {
                    method: 'GET',
                    params: {
                        token: token,
                        _id : objetivo_id
                    }
                });
            }




        }
    });
