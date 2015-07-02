angular.module('login.controllers', ['login.services'])

.controller('loginController', function($rootScope, $scope, API, $window, $state) {

    $scope.user = {
        email: '',
        contrasena: ''
    };

    $scope.ingresar = function() { // Duda con ingresar
        var email = this.user.email;
        var contrasena = this.user.contrasena;
        if (!email || !contrasena) {

            $rootScope.show('No se admiten espacios vacíos');

        } else {

            API.signin({
                email: email,
                contrasena: contrasena
            }).success(function(data) {
                console.log(data);
                $rootScope.setToken(data._id); // create a session kind of thing on the client side
                $rootScope.show("Cargando...");
                $window.location.href = ('#/primerNivel');
            }).error(function(error) {
                $rootScope.show(error.error);
            });
        }
    }

    $scope.logueado = function() {
        var token = $rootScope.getToken();
        if (token != '') {
            $window.location.href = ('#/list');
        }
    }

    $scope.irRegistro = function() {
        $window.location.href = ('#/registrar');
    }

    $scope.irPassword = function() {
        $window.location.href = ('#/resetPassword');
    }
})

.controller('resetController', function($rootScope, API, $scope) {
    $scope.user = {
        email: ''
    };

    $scope.enviar = function() {
        var email = this.user.email;
        if (!email) {

            $rootScope.show("No se admiten espacios vacíos");

        } else {

            API.resetPassword({
                email: email
            }).success(function(data) {
                console.log('Successs');
                $rootScope.show("Revise su bandeja de entrada");
            }).error(function(error) {
                $rootScope.show(error.error);
            });
        }
    }
})

.controller('newPassController', function($rootScope, API, $scope, $window, $ionicPopup) {
    $scope.user = {
        id: '',
        contrasenaRep: '',
        contrasenaNueva: '',
        codigo: ''
    };


    $scope.aceptar = function() {

        var contrasena = this.user.contrasenaNueva;
        var contrasenaRep = this.user.contrasenaRep;
        var ident = this.user.id;
        console.log(ident);
        if (!contrasenaRep || !contrasena || !ident) {

            $rootScope.show("No se admiten espacios vacíos");

        } else {
            if (contrasena == contrasenaRep) {

                API.newPassword({
                    id: ident,
                    contrasena: contrasena
                }).success(function(data) {
                    console.log('Successs');
                    $rootScope.show("contraseña actualizada");
                    $window.location.href = ('#/entrar');
                }).error(function(error) {
                    $rootScope.show(error.error);
                });
            }
        }
    };

    $scope.insertarCodigo = function() {
        $scope.data = {}
        var bandera = true;
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.id">',
            title: 'Confirmación',
            subTitle: 'Ingrese el código que le fue asignado',
            scope: $scope,
            buttons: [{
                text: 'Cancelar',
                onTap: function() {
                    bandera = false;
                    window.location.href = ('#/entrar');
                }
            }, {
                text: '<b>Aceptar</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.id) {
                        alert("no se permiten campos vacíos");
                        e.preventDefault();
                    } else {
                        return $scope.data.id;

                    }
                }
            }]
        });
        myPopup.then(function(res) {
            console.log(bandera);
            if (bandera == true) {
                API.buscarCodigo({
                    token: res
                }).success(function(data) {
                    console.log('Successs');
                    console.log(data);
                    $scope.user.id = data._id;
                }).error(function(error) {
                    $rootScope.show(error.error);
                    $window.location.href = ('#/entrar');
                });

            }
        });
    }


})

.controller('myListCtrl', function($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $scope.newTask = function() {
        API.getAll($rootScope.getToken()).success(function(data, status, headers, config) {
            $rootScope.show("Cargando");
            console.log(data);
        }).error(function(data, status, headers, config) {
            $rootScope.show("Oops Error, por favor inténtelo más tarde");
        });
    }
    $scope.irModificar = function() {
        $window.location.href = ('#/modificar');
    }
})

.controller('mapController', function($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $scope.irPreguntas = function() {
        $window.location.href = ('#/preguntas');
    }
})

/*.controller('modalController', function($scope) {

})*/

.controller('preguntasController', function($rootScope, $scope, API, $timeout, $ionicModal, $window) {

    $scope.elemento = {
        id: '',
        titulo: '',
        descripcion: '',
        fecha: ''
    };

    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $ionicModal.fromTemplateUrl('newQuestion.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.newQuestion = modal;
    });

    $scope.limpiar = function() {
        $scope.elemento.titulo = '';
        $scope.elemento.descripcion = '';
        $scope.elemento.fecha = '';
        API.verificarPregunta($rootScope.getToken()).success(function(data, status, headers, config) {
            $rootScope.show("Cargando");
            $scope.newQuestion.show();
        }).error(function(data, status, headers, config) {
            $rootScope.show(data.error);
        });

    }


    $scope.question = function(pregunta) {
            
        $scope.elemento.titulo = pregunta.titulo;
        $scope.elemento.descripcion = pregunta.descripcion;
        $scope.elemento.fecha = pregunta.fechaLimite;
        $scope.elemento.id = pregunta._id;
        $scope.modal.show();
    }

    $scope.createQuestion = function() {
        var titulo = $scope.elemento.titulo
        var descripcion = $scope.elemento.descripcion;
        var fecha = $scope.elemento.fecha;

        if (!titulo || !descripcion || !fecha) {
            $rootScope.show("No se admiten campos vacíos");
        } else {
            API.anadirPregunta({
                titulo: titulo,
                descripcion: descripcion,
                fechaLimite: fecha
            }, $rootScope.getToken()).success(function(data, status, headers, config) {
                $rootScope.show("Su pregunta ha sido enviada");
                $scope.newQuestion.hide();
                $scope.refrescar();
            }).error(function(data, status, headers, config) {
                $rootScope.show(data.error);
            });
        }

    }

    $scope.unirse = function(problema){
        API.verificarPregunta($rootScope.getToken()).success(function(data, status, headers, config) {
            console.log("verificó pregunta");
            API.unirseProblema({
                _id: $scope.elemento.id
            }, $rootScope.getToken()).success(function(data, status, headers, config) {
                $rootScope.show("Se ha unido a la pregunta",problema.titulo);
                $scope.modal.hide();
                $scope.refrescar();
            }).error(function(data, status, headers, config) {
                $rootScope.show(data.error);
            });
        }).error(function(data, status, headers, config) {
            $rootScope.show(data.error);
        });
        
    }

    $scope.refrescar = function() {

        API.getAll($rootScope.getToken()).success(function(data, status, headers, config) {

            $scope.items = [];
            for (var i = 0; i < data.length; i++) {

                $scope.items.push(data[i]);

            };
            if ($scope.items.length == 0) {
                $scope.noData = true;
            } else {
                $scope.noData = false;
            }

        }).error(function(data, status, headers, config) {
            $rootScope.show("Hay un errorcito, qué pena");
        });
    };

})

.controller('RegistroController', function($rootScope, $scope, API, $window) {

    $scope.user = {
        email: '',
        nombre: '',
        apellido: '',
        genero: '',
        contrasenaRep: '',
        contrasena: ''
    };

    $scope.registrar = function() {
        var email = this.user.email;
        var contrasena = this.user.contrasena;
        var nombre = this.user.nombre;
        var apellido = this.user.apellido;
        var genero = this.user.genero;
        var contrasenaRep = this.user.contrasenaRep;

        console.log(genero);
        if (!email || !contrasena || !nombre || !apellido || !contrasenaRep) {

            $rootScope.show('No se admiten espacios vacíos');

        } else {

            if (contrasenaRep != contrasena) {
                $rootScope.show('Las contraseñas no coinciden');
            } else {

                API.registrar({
                    //_id: email,
                    email: email,
                    contrasena: contrasena,
                    nombre: nombre,
                    apellido: apellido,
                    genero: genero,
                    colorCabello: "#000000",
                    colorCara: "#ffe4c4",
                    colorCamisa: "#228b22",
                    puntos: 10,
                    nivel: "1",
                    trofeos: [],
                    accesorios_id: []
                }).success(function(data) {
                    console.log('Successs');
                    $rootScope.show("Cargando...");
                    $window.location.href = ('#/entrar');
                }).error(function(error) {
                    $rootScope.show(error.error);
                });
            }
        }
    }
})

.controller('modificarController', function($rootScope, $scope, API, $window, $ionicPopup) {

    $scope.user = {

        email: '',
        contrasena: '',
        nombre: '',
        apellido: '',
    };

    $scope.userCont = {
        contrasenaNueva: '',
        contrasenaRep: '',
        contrasenaAct: ''

    };
    $scope.userDatos = {

        email: '',
        nombre: '',
        apellido: ''
    };

    $scope.modificarDatos = function(contrasena) {

        var contrasena = contrasena;
        var email = this.user.email;

        console.log(contrasena);
        if (!contrasena || !email) {

            $rootScope.show('No se admiten espacios vacíos');

        } else {

            API.modificarDatos({
                contrasena: contrasena,
                email: email
            }, $rootScope.getToken()).success(function(data) {
                console.log('Successs');
                $rootScope.show("Cargando...");
                $window.location.href = ('#/list');
            }).error(function(error) {
                $rootScope.show(error.error);
            });

        }
    }
    $scope.showPopup = function() {
        $scope.data = {}
        var bandera = true;
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="password" ng-model="data.contrasena">',
            title: 'Confirmación',
            subTitle: 'Ingrese la contraseña para confirmar los cambios',
            scope: $scope,
            buttons: [{
                text: 'Cancelar',
                onTap: function() {
                    bandera = false;
                }
            }, {
                text: '<b>Aceptar</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.contrasena) {
                        alert("no se permiten campos vacíos");
                        e.preventDefault();
                    } else {
                        return $scope.data.contrasena;
                    }
                }
            }]
        });
        myPopup.then(function(res) {
            console.log(bandera);
            if (bandera == true) {
                console.log(res);
                $scope.modificarDatos(res);
            }
        });
        /* $timeout(function() {
             myPopup.close(); //close the popup after 3 seconds for some reason
         }, 100000);*/

    };

    $scope.modificarContrasena = function() {

        var contrasenaNueva = this.userCont.contrasenaNueva;
        var contrasenaAct = this.userCont.contrasenaAct;
        var contrasenaRep = this.userCont.contrasenaRep;
        if (!contrasenaNueva || !contrasenaRep || !contrasenaAct) {

            $rootScope.show('No se admiten espacios vacíos');

        } else {
            if (contrasenaNueva != contrasenaRep) {
                $rootScope.show('Las contraseñas ingresadas como nuevas no coinciden ');
            } else {
                console.log("contraseñas coinciden");
                API.modificarContrasena({
                    contrasena: contrasenaAct,
                    contrasenaNueva: contrasenaNueva


                }, $rootScope.getToken()).success(function(data) {
                    console.log('Successs');
                    $rootScope.show("Cargando...");
                    $window.location.href = ('#/list');
                }).error(function(error) {
                    $rootScope.show(error.error);
                });
            }
        }


    };

    $scope.mostrarDatos = function() {


        API.mostrarInfo($rootScope.getToken()).success(function(data) {
            $scope.user.email = data[0].email;
            $scope.user.nombre = data[0].nombre;
            $scope.user.apellido = data[0].apellido;
            console.log("mostrar");
            console.log($scope.userDatos.nombre);
        }).error(function(error) {
            $rootScope.show(error.error);
        });
    }

})
