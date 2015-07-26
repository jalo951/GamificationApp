angular.module('login.controllers', ['login.services'])

.controller('loginController', function($rootScope, $scope, API, $window, $state, $ionicHistory) {

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
                $rootScope.setToken(data._id); // create a session kind of thing on the client side
                $rootScope.show("Cargando...");
                $window.location.href = ('#/home');
            }).error(function(error) {
                $rootScope.show(error.error);
            });
        }
    }

    /*$scope.logueado = function() {
        var token = $rootScope.getToken();
        if (token != '') {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $window.location.href = ('#/home');
        }
    }*/

    $scope.logueado = function() {
        var token = $rootScope.getToken();
        var sesionActiva = $rootScope.isSessionActive();
        if (sesionActiva) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $window.location.href = ('#/home');
        }
    }

    $scope.logueado();

    $scope.irRegistro = function() {
        $state.go('registrar');
    }

    $scope.irPassword = function() {
        $window.location.href = ('#/resetPassword');
    }

    $scope.irSubir = function() {
        $window.location.href = ('#/subir');
    }
})

.controller('resetController', function($rootScope, API, $scope, $state) {
    $scope.user = {
        email: ''
    };

    $scope.goBack = function() {
        $state.go('entrar');
    }

    $scope.enviar = function() {
        var email = this.user.email;
        if (!email) {

            $rootScope.show("No se admiten espacios vacíos");

        } else {

            API.resetPassword({
                email: email
            }).success(function(data) {
                $rootScope.showAlert('Recuperación de password', 'Revisa tu bandeja de entrada');
            }).error(function(error) {
                $rootScope.show(error.error);
            });
        }
    }
})

.controller('uploadController', function($scope, $rootScope, API) {

    $rootScope.$on('event:file:selected', function(event, data) {
        API.anadirImagen({
            data: data.image
        }, $rootScope.getToken()).success(function(data, status, headers, config) {
            $rootScope.show("Su Imagen ha sido enviada, Conseguiste 14567 puntos");
        }).error(function(data, status, headers, config) {
            $rootScope.show(data.error);
        })
    });

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
        if (!contrasenaRep || !contrasena || !ident) {
            $rootScope.show("No se admiten espacios vacíos");
        } else {
            if (contrasena == contrasenaRep) {

                API.newPassword({
                    id: ident,
                    contrasena: contrasena
                }).success(function(data) {
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
            if (bandera == true) {
                API.buscarCodigo({
                    token: res
                }).success(function(data) {
                    $scope.user.id = data._id;
                }).error(function(error) {
                    $rootScope.show(error.error);
                    $window.location.href = ('#/entrar');
                });

            }
        });
    }

})

.controller('mapController', function($rootScope, $scope, API, $window, $state) {
    $scope.irPreguntas = function() {
        $state.go('app.preguntas');
    }

    $scope.reto = function() {
        API.nuevoReto($rootScope.getToken()).success(function(data, status, headers, config) {
            $rootScope.show("Conseguiste 5 puntos");
        }).error(function(data, status, headers, config) {
            $rootScope.show("Oops Error, por favor inténtelo más tarde");
        });
    }

    $scope.irObjetivos = function() {
        $state.go('app.objetivos');
    }

})

.controller('preguntasController', function($rootScope, $scope, API, $timeout, $ionicModal, $window) {

    $scope.elemento = {
        id: '',
        titulo: '',
        descripcion: '',
        fecha: '',
        nombreAutor: '',
        apellidoAutor: ''
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
            $rootScope.showAlert('Error', data.error);
        });

    }


    $scope.question = function(pregunta) {

        $scope.elemento.titulo = pregunta.titulo;
        $scope.elemento.descripcion = pregunta.descripcion;
        $scope.elemento.fecha = new Date(pregunta.fechaLimite);
        $scope.elemento.id = pregunta._id;
        API.mostrarInfo(pregunta.autor_id).success(function(data){
            $scope.elemento.nombreAutor = data[0].nombre;
            $scope.elemento.apellidoAutor = data[0].apellido;
             $scope.modal.show();
        });
       
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
                $rootScope.show("Su pregunta ha sido enviada, Conseguiste 15 puntos");
                $scope.newQuestion.hide();
                $scope.refrescar();
            }).error(function(data, status, headers, config) {
                $rootScope.show(data.error);
            });
        }

    }

    $scope.unirse = function() {
        API.verificarPregunta($rootScope.getToken()).success(function(data, status, headers, config) {
            API.unirseProblema({
                _id: $scope.elemento.id
            }, $rootScope.getToken()).success(function(data, status, headers, config) {
                $rootScope.show("Se ha unido a la pregunta " + $scope.elemento.titulo + ", Conseguiste 10 puntos");
                $scope.modal.hide();
                API.cambiarNivel($scope.elemento.id);
                $scope.refrescar();
            }).error(function(data, status, headers, config) {
                $rootScope.showAlert('Error', data.error);
            });
        }).error(function(data, status, headers, config) {
            $rootScope.showAlert('Error', data.error);
        });

    }

    $scope.refrescar = function() {

        API.eliminarPreguntas();

        API.getAll($rootScope.getToken()).success(function(data, status, headers, config) {

            $scope.items = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].finalizado == false) {
                    $scope.items.push(data[i]);
                }
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

.controller('RegistroController', function($rootScope, $scope, API, $window, $state) {

    $scope.user = {
        email: '',
        nombre: '',
        apellido: '',
        genero: '',
        contrasenaRep: '',
        contrasena: ''
    };

    $scope.goBack = function() {
        $state.go('entrar');
    }

    $scope.registrar = function() {
        var email = this.user.email;
        var contrasena = this.user.contrasena;
        var nombre = this.user.nombre;
        var apellido = this.user.apellido;
        var genero = this.user.genero;
        var contrasenaRep = this.user.contrasenaRep;
        var foto;

        console.log(genero);
        if (!email || !contrasena || !nombre || !apellido || !contrasenaRep|| !genero) {

            $rootScope.show('No se admiten espacios vacíos');

        } else {

            if (contrasenaRep != contrasena) {
                $rootScope.show('Las contraseñas no coinciden');
            } else {
                if(genero == 'femenino'){
                    foto= "http://res.cloudinary.com/udea/image/upload/v1437944503/55ad3491b827529b13f7ef89_u5yzvd.jpg";
                }else{
                    console.log("masculino");
                    foto = "http://res.cloudinary.com/udea/image/upload/v1437944425/55ad3491b827529b13f7ef89_g79h5q.jpg";
                }
                API.registrar({
                    //_id: email,
                    email: email,
                    contrasena: contrasena,
                    nombre: nombre,
                    apellido: apellido,
                    genero: genero,
                    puntos: 10,
                    nivel: 1,
                    foto: foto
                }).success(function(data) {
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
        if (!contrasena || !email) {

            $rootScope.show('No se admiten espacios vacíos');

        } else {

            API.modificarDatos({
                contrasena: contrasena,
                email: email
            }, $rootScope.getToken()).success(function(data) {
                $rootScope.show("Cargando...");
                $window.location.href = ('#/home');
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
            if (bandera == true) {
                $scope.modificarDatos(res);
            }
        });

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

                API.modificarContrasena({
                    contrasena: contrasenaAct,
                    contrasenaNueva: contrasenaNueva
                }, $rootScope.getToken()).success(function(data) {
                    $rootScope.show("Cargando...");
                    $window.location.href = ('#/home');
                }).error(function(error) {
                    $rootScope.show(error.error);
                });
            }
        }
    };

    $scope.mostrarDatos = function() {
        $scope.user.email = '';
        $scope.user.nombre = '';
        $scope.user.contrasena = '';
        $scope.user.apellido = '';

        API.mostrarInfo($rootScope.getToken()).success(function(data) {
            $scope.user.email = data[0].email;
            $scope.user.nombre = data[0].nombre;
            $scope.user.apellido = data[0].apellido;
        }).error(function(error) {
            $rootScope.show(error.error);
        });
    }

    $scope.mostrarDatos();
})

.controller('rankingController', function($rootScope, $scope, API, $window) {

    $scope.visualizarRanking = function() {
        API.verRanking($rootScope.getToken()).success(function(data) {
            $scope.users = [];
            var i;
            for (i = 0; i < data.length; i++) {
                $scope.users.push(data[i]);
            };
            if ($scope.users.length == 0) {
                $scope.noData = true;
            } else {
                $scope.noData = false;
            }
        }).error(function(data, status, headers, config) {
            $rootScope.show("Hay un errorcito, qué pena");
        });
    }
})

.controller('objetivosController', function($rootScope, $scope, API, $timeout, $ionicModal, $window) {

    $scope.objetivo = {
        _id: '',
        votos: 0,
        descripcion: '',
        votosAcumulados: 0,
        problema_id: '',
        autorNombre: '',
        autorApellido: ''
    };

    $ionicModal.fromTemplateUrl('votarModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.votarModal = modal;
    });

    $scope.objective = function(object) {
        console.log(object);
        $scope.objetivo._id = object._id;
        //$scope.objetivo.votos = object.votos;
        $scope.objetivo.votosAcumulados = object.votos;
        $scope.objetivo.descripcion = object.descripcion;
        API.mostrarInfo(object.autor_id).success(function(data) {
            $scope.objetivo.autorNombre = data[0].nombre;
            $scope.objetivo.autorApellido = data[0].apellido;
            $scope.votarModal.show();
        });
    }

    $scope.votar = function(voto) {
        API.verificarVotacion($rootScope.getToken(), $scope.objetivo._id).success(function(data) {
            API.votarObjetivo($rootScope.getToken(), {
                _id: $scope.objetivo._id,
                votos: parseInt(voto)
            }).success(function(data) {
                $scope.visualizarObjetivos();
                $rootScope.show("el objetivo ha recibido " + voto + " votos");
                $scope.votarModal.hide();
                API.verificarPasoNivel($scope.objetivo.problema_id);
            }).error(function(data, status, headers, config) {
                $rootScope.show(data.error);
            });
        }).error(function(data) {
            $scope.votarModal.hide();
            $scope.visualizarObjetivos();
            $rootScope.show(data.error);
        });

    }
    $scope.visualizarObjetivos = function() {
        API.preguntasUsuario($rootScope.getToken()).success(function(problemas) {
            var i;
            for (i = 0; i < problemas.length; i++) {
                if (problemas[i].finalizado == false) {
                    break;
                }
            }
            $scope.objetivo.problema_id = problemas[i]._id;
            API.verObjetivos(problemas[i]._id).success(function(data) {

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
                $rootScope.show(error);
            });

        });

    }

    $scope.anadirObjetivo = function() {
        var descripcion = $scope.objetivo.descripcion;
        var problema = $scope.objetivo.problema_id;
        if (!descripcion) {
            $rootScope.show("No se admiten campos vacíos");
        } else {
            API.nuevoObjetivo({
                descripcion: descripcion,
                problema_id: problema
            }, $rootScope.getToken()).success(function(data) {
                $rootScope.show("Agregaste un objetivo nuevo, ganaste 2 puntos");
                API.verificarPasoNivel($scope.objetivo.problema_id);
                $scope.newObjective.hide();
                $scope.visualizarObjetivos();
            }).error(function(error) {
                $rootScope.show("No se agregó el objetivo");
            });
        }
    }

    $scope.limpiarObjetivo = function() {
        $scope.objetivo._id = '';
        $scope.objetivo.votos = 0,
            $scope.objetivo.descripcion = '';
        $scope.objetivo.votosAcumulados = 0;
        $scope.newObjective.show();
    }

    $ionicModal.fromTemplateUrl('newObjective.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.newObjective = modal;
    });

})

.controller('homeController', function($rootScope, $scope, API, $window) {

    $scope.nivel = function() {
        API.mostrarInfo($rootScope.getToken()).success(function(data) {
            if (data[0].nivel == 1) {
                $window.location.href = ('#/app/primerNivel');
            } else {
                if (data[0].nivel == 2) {
                    $window.location.href = ('#/app/segundoNivel');
                } else {
                    if (data[0].nivel == 3) {
                        $window.location.href = ('#/tercerNivel');
                    } else {
                        $window.location.href = ('#/mundoMuertos');
                    }
                }

            }
        }).error(function(data) {

        });
    }

    $scope.irModificar = function() {
        //$window.location.reload();
        $window.location.href = ('#/app/modificar');
    }

    $scope.irPerfil = function(){
        //$window.location.reload();
        $window.location.href = ('#/app/perfil');
    }
})

.controller('perfilController', function($rootScope, $scope, API, $window) {
    $scope.datosUsuario = {
        _id: '',
        nombre: '',
        apellido: '',
        genero: '',
        nivel: '',
        puntos: '',
        email: '',
        nombrePreguntaActual: '',
        foto: ''
    };

    $scope.verPerfil = function() {

        API.mostrarInfo($rootScope.getToken()).success(function(data) {
            $scope.datosUsuario._id = data[0]._id;
            $scope.datosUsuario.nombre = data[0].nombre;
            $scope.datosUsuario.apellido = data[0].apellido;
            $scope.datosUsuario.genero = data[0].genero;
            $scope.datosUsuario.nivel = data[0].nivel;
            $scope.datosUsuario.puntos = data[0].puntos;
            $scope.datosUsuario.email = data[0].email;
            $scope.datosUsuario.foto = data[0].foto;


            /*API.cargarImagen($rootScope.getToken()).success(function(image) {
                console.log('Intenta cargar la imagen pueees!');
                //$scope.datosUsuario.foto = image;
                console.log(image);
            });*/

            API.preguntasUsuario($rootScope.getToken()).success(function(preguntas) {
                var i;
                $scope.items = [];
                for (i = 0; i < preguntas.length; i++) {
                    if (preguntas[i].finalizado) {
                        $scope.items.push(preguntas[i]);
                    } else {
                        $scope.datosUsuario.nombrePreguntaActual = preguntas[i].titulo;
                    }
                }
            });

        });
    }

    $rootScope.$on('event:file:selected', function(event, data) {


        API.anadirImagen({
            data: data.image,
            id_imagen: $scope.datosUsuario._id
        }, $rootScope.getToken()).success(function(data, status, headers, config) {
            $rootScope.show('Su foto de perfil ha sido cambiada con éxito');

        }).error(function(data, status, headers, config) {
            $rootScope.show(data.error);
        })
    });

    $scope.verPerfil();
})
