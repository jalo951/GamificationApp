angular.module('login.controllers', ['login.services'])

.controller('loginController', function($rootScope, $scope, API, $window) {

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
                $window.location.href = ('#/list');
            }).error(function(error) {
                $rootScope.show(error.error);
            });
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

.controller('myListCtrl', function($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $scope.newTask = function() {
        API.getAll($rootScope.getToken()).success(function(data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            console.log(data);
        }).error(function(data, status, headers, config) {
            $rootScope.show("Oops something went wrong!! Please try again later");
        });
    }
    $scope.irModificar = function() {
        $window.location.href = ('#/modificar');
    }
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
