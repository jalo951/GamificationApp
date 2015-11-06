angular.module('login.controllers', ['login.services'])

.controller('loginController', function($ionicPopup, $ionicPlatform, $rootScope, $scope, API, $window, $state) {

    $scope.user = {
        email: '',
        contrasena: ''
    };

    $ionicPlatform.registerBackButtonAction(function(event) {
        if (($state.current.name == "home") || ($state.current.name == "entrar")) {
            $scope.showConfirm();
        } else {
            navigator.app.backHistory();
        }
    }, 100);

    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Salir',
            template: '¿Desea salir de la aplicación?',
            cancelText: 'No',
            cancelType: 'button-positive',
            okText: 'Sí',
            okType: 'button-outline button-assertive'
        });
        confirmPopup.then(function(res) {
            if (res) {
                navigator.app.exitApp();
            }
        });
    };

    $scope.ingresar = function() {

        var email = this.user.email;
        var contrasena = this.user.contrasena;
        if (!email || !contrasena) {
            $rootScope.show('No se admiten campos vacíos');
        } else {
            API.signin({
                email: email,
                contrasena: contrasena
            }).success(function(data) {
                $rootScope.setToken(data._id);
                $rootScope.refresh();
                $rootScope.refrescar("Cargando...", 'home');
            }).error(function(error) {
                $rootScope.show(error.error);
            });
        }
    }

    $scope.logueado = function() {
        var token = $rootScope.getToken();
        var sesionActiva = $rootScope.isSessionActive();
        if (sesionActiva) {
            $state.go('home');
        }
    }

    $scope.logueado();

    $scope.irRegistro = function() {
        $state.go('registrar');
    }

    $scope.irPassword = function() {
        $state.go('resetPassword');
    }

    $scope.irSubir = function() {
        $state.go('subir');
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
            $rootScope.show("No se admiten campos vacíos");
        } else {
            API.resetPassword({
                email: email
            }).success(function(data) {
                $rootScope.showAlert('Recuperación de contraseña', 'Revisa tu bandeja de entrada');
            }).error(function(error) {
                $rootScope.show(error.error);
            });
        }
    }
})

.controller('newPassController', function($rootScope, API, $scope, $ionicPopup, $state) {
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
            $rootScope.show("No se admiten campos vacíos");
        } else {
            if (contrasena == contrasenaRep) {
                API.newPassword({
                    id: ident,
                    contrasena: contrasena
                }).success(function(data) {
                    $rootScope.showAlert('Recuperación de contraseña', 'Contraseña actualizada');
                    $state.go('entrar');
                }).error(function(error) {
                    $rootScope.showAlert('Error', error.error);
                });
            }
        }
    };

    $scope.insertarCodigo = function() {
        $scope.data = {}
        var bandera = true;
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.id">',
            title: 'Confirmación',
            subTitle: 'Ingrese el código que le fue asignado',
            scope: $scope,
            buttons: [{
                text: 'Cancelar',
                onTap: function() {
                    bandera = false;
                    $state.go('entrar');
                }
            }, {
                text: '<b>Aceptar</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.id) {
                        $rootScope.show("No se admiten campos vacíos");
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
                    $rootScope.showAlert('Error', error.error);
                    $state.go('entrar');
                });

            }
        });
    }

})

.controller('segundoNivelController', function($rootScope, $scope, API, $state, $ionicModal) {
    $scope.preguntaUser = {
        preguntaTitulo: '',
        preguntaDescripcion: ''
    }


    $scope.reto = function() {
        var retoSelect = Math.floor(Math.random() * 2);
        if (retoSelect == 0) {
            $state.go('app.reto1');
        }
        if (retoSelect == 1) {
            $state.go('app.reto2');
        }
    }

    $scope.irObjetivos = function() {
        $rootScope.refrescar("Cargando...", 'app.objetivos');
    }

    $scope.verPregunta = function() {
        API.preguntasUsuario($rootScope.getToken()).success(function(problemas) {
            var i;
            for (i = 0; i < problemas.length; i++) {
                if (problemas[i].finalizado == false) {
                    break;
                }
            }
            $scope.preguntaUser.preguntaTitulo = problemas[i].titulo;
            $scope.preguntaUser.preguntaDescripcion = problemas[i].descripcion;
        });
    }
    $scope.mostrarPregunta = function() {
        $scope.verPregunta();
        $scope.preguntaActual.show();
    }

    $ionicModal.fromTemplateUrl('preguntaActual.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.preguntaActual = modal;
    });

    $scope.verificarNivel = function() {
        if ($rootScope.getToken() == '') {
            $rootScope.refresh();
            $state.go('error');
        } else {
            API.mostrarInfo($rootScope.getToken()).success(function(data) {
                if (data[0].nivel != 2) {
                    $rootScope.refresh();
                    $rootScope.refrescar("Cargando...", 'error');
                }
            });
        }
    }
    $scope.verificarNivel();

})

.controller('primerNivelController', function($rootScope, $scope, API, $state) {
    $scope.irPreguntas = function() {
        $state.go('app.preguntas');
        $rootScope.refresh();
    }

    $scope.reto = function() {
        /* API.nuevoReto($rootScope.getToken()).success(function(data, status, headers, config) {
             $rootScope.show("¡Bien hecho! Conseguiste 5 puntos");
         }).error(function(data, status, headers, config) {
             $rootScope.show("Ha ocurrido un error, por favor inténtelo más tarde");
         });*/
        var retoSelect = Math.floor(Math.random() * 2);
        if (retoSelect == 0) {
            $rootScope.refrescar('Cargando..','app.reto1');
            $rootScope.hide();
        }
        if (retoSelect == 1) {
             $rootScope.refrescar('Cargando..','app.reto2');
             $rootScope.hide();
        }
    }

    $scope.verificarNivel = function() {
        if ($rootScope.getToken() == '') {
            $rootScope.refresh();
            $rootScope.refrescar("Cargando...", 'error');
        } else {
            API.mostrarInfo($rootScope.getToken()).success(function(data) {
                if (data[0].nivel != 1) {
                    $rootScope.refresh();
                    $rootScope.refrescar("Cargando...", 'error');
                }
            });
        }
    }

    $scope.verificarNivel();
})

.controller('tercerNivelController', function($rootScope, $scope, API, $state, $ionicModal) {

    $scope.reto = function() {
        /*API.nuevoReto($rootScope.getToken()).success(function(data, status, headers, config) {
            $rootScope.show("Conseguiste 5 puntos");
        }).error(function(data, status, headers, config) {
            $rootScope.show("Ha ocurrido un error, por favor inténtelo más tarde");
        });*/
        var retoSelect = Math.floor(Math.random() * 2);
        if (retoSelect == 0) {
            $state.go('app.reto1');
        }
        if (retoSelect == 1) {
            $state.go('app.reto2');
        }

    }

    $scope.irTrabajoFinal = function() {
        $state.go('app.trabajoFinal');
    }
    $scope.objetivosSeleccionados = function() {
        API.preguntasUsuario($rootScope.getToken()).success(function(problemas) {
            var i;
            var problemaCurso = false;
            for (i = 0; i < problemas.length; i++) {
                if (problemas[i].finalizado == false) {
                    problemaCurso = true;
                    break;
                }
            }
            if (problemaCurso) {
                API.verObjetivos(problemas[i]._id).success(function(data) {
                    var i;
                    var votosMax = 0;
                    $scope.items = [];
                    for (i = 0; i < data.length; i++) {
                        if (data[i].votos >= votosMax) {
                            votosMax = data[i].votos;
                        }
                    }

                    for (i = 0; i < data.length; i++) {
                        if (data[i].votos == votosMax) {
                            $scope.items.push(data[i]);
                        }
                    }

                    if ($scope.items.length == 0) {
                        $scope.noData = true;
                    } else {
                        $scope.noData = false;
                    }


                }).error(function(data, status, headers, config) {
                    $rootScope.show(error);
                });
            }

        });

    }

    $scope.mostrarObjetivosSelec = function() {
        $scope.objetivosSelec.show();
    }

    $ionicModal.fromTemplateUrl('objetivosSelec.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.objetivosSelec = modal;
    });

    $scope.verificarNivel = function() {
        if ($rootScope.getToken() == '') {
            $rootScope.refresh();
            $rootScope.refrescar("Cargando...", 'error');
        } else {
            API.mostrarInfo($rootScope.getToken()).success(function(data) {
                if (data[0].nivel != 3) {
                    $rootScope.refresh();
                    $rootScope.refrescar("Cargando...", 'error');
                }
            });
        }
    }
    $scope.verificarNivel();
})

.controller('preguntasController', function($rootScope, $scope, API, $timeout, $ionicModal) {

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
        API.mostrarInfo(pregunta.autor_id).success(function(data) {
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
                $rootScope.show("Su pregunta ha sido enviada, conseguiste 15 puntos");
                $scope.newQuestion.hide();
                $scope.refresh();
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
            $rootScope.show("Ha ocurrido un error, inténtelo más tarde");
        });
    };

})

.controller('RegistroController', function($rootScope, $scope, API, $state) {

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
        if (!email || !contrasena || !nombre || !apellido || !contrasenaRep || !genero) {
            $rootScope.show('No se admiten campos vacíos');
        } else {
            if (contrasenaRep != contrasena) {
                $rootScope.show('Las contraseñas no coinciden');
            } else {
                if (genero == 'femenino') {
                    foto = "http://res.cloudinary.com/udea/image/upload/v1437944503/55ad3491b827529b13f7ef89_u5yzvd.jpg";
                } else {
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
                    $state.go('entrar');
                }).error(function(error) {
                    $rootScope.show(error.error);
                });
            }
        }
    }
})

.controller('modificarController', function($rootScope, $scope, API, $ionicPopup) {

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
                $state.go('home');
            }).error(function(error) {
                $rootScope.show(error.error);
            });

        }
    }

    $scope.showPopup = function() {
        $scope.data = {}
        var bandera = true;
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
                        $rootScope.show("No se permiten campos vacíos");
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
            $rootScope.show('No se admiten campos vacíos');
        } else {
            if (contrasenaNueva != contrasenaRep) {
                $rootScope.show('Las contraseñas ingresadas como nuevas no coinciden');
            } else {

                API.modificarContrasena({
                    contrasena: contrasenaAct,
                    contrasenaNueva: contrasenaNueva
                }, $rootScope.getToken()).success(function(data) {
                    $rootScope.show("Cargando...");
                    $state.go('home');
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

.controller('rankingController', function($rootScope, $scope, API, $ionicModal, $window) {
    $scope.datosOtroUsuario = {
        _id: '',
        nombre: '',
        apellido: '',
        nivel: '',
        puntos: '',
        email: '',
        nombrePreguntaActual: '',
        foto: ''
    };

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

    $scope.verPerfilOtros = function(usuario) {
        $scope.datosOtroUsuario._id = '';
        $scope.datosOtroUsuario.nombre = '';
        $scope.datosOtroUsuario.apellido = '';
        $scope.datosOtroUsuario.nivel = '';
        $scope.datosOtroUsuario.puntos = '';
        $scope.datosOtroUsuario.email = '';
        $scope.datosOtroUsuario.foto = '';
        $scope.datosOtroUsuario.nombrePreguntaActual = '';
        $scope.datosOtroUsuario._id = usuario._id;
        $scope.datosOtroUsuario.nombre = usuario.nombre;
        $scope.datosOtroUsuario.apellido = usuario.apellido;
        $scope.datosOtroUsuario.nivel = usuario.nivel;
        $scope.datosOtroUsuario.puntos = usuario.puntos;
        $scope.datosOtroUsuario.email = usuario.email;
        $scope.datosOtroUsuario.foto = usuario.foto;
        API.preguntasUsuario($scope.datosOtroUsuario._id).success(function(preguntas) {
            var i;
            $scope.items = [];
            for (i = 0; i < preguntas.length; i++) {
                if (preguntas[i].finalizado) {
                    $scope.items.push(preguntas[i]);
                } else {
                    $scope.datosOtroUsuario.nombrePreguntaActual = preguntas[i].titulo;
                }
            }
        });
        $scope.perfilUsuarios.show();
    }
    $ionicModal.fromTemplateUrl('perfilUsuarios.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.perfilUsuarios = modal;
    });

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
        $scope.objetivo._id = object._id;
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
                $rootScope.show("Ha ocurrido un error, no se agregó el objetivo");
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
                        $window.location.href = ('#/app/tercerNivel');
                    } else {
                        $window.location.href = ('#/mundoMuertos');
                    }
                }

            }
        }).error(function(data) {

        });
    }

    $scope.irModificar = function() {
        $window.location.href = ('#/app/modificar');
    }

    $scope.irPerfil = function() {
        $window.location.href = ('#/app/perfil');
    }
})

.controller('perfilController', function($ionicModal, $rootScope, $state, $scope, API, $window) {
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

    $scope.elemento = {
        id: '',
        titulo: '',
        descripcion: '',
        fecha: '',
        nombreAutor: '',
        apellidoAutor: '',
        file: ''
    };


    $ionicModal.fromTemplateUrl('modalPregunta.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalPregunta = modal;
    });

    $scope.getInfo = function(pregunta) {

        $scope.elemento.titulo = pregunta.titulo;
        $scope.elemento.descripcion = pregunta.descripcion;
        $scope.elemento.fecha = new Date(pregunta.fechaLimite);
        $scope.elemento.id = pregunta._id;
        $scope.elemento.file = pregunta.trabajo;
        API.mostrarInfo(pregunta.autor_id).success(function(data) {
            $scope.elemento.nombreAutor = data[0].nombre;
            $scope.elemento.apellidoAutor = data[0].apellido;
            $scope.modalPregunta.show();
        });

    }

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

            API.preguntasUsuario($rootScope.getToken()).success(function(preguntas) {
                var i;
                $scope.items = [];
                for (i = 0; i < preguntas.length; i++) {
                    if (preguntas[i].finalizado) {
                        $scope.items.push(preguntas[i]);
                    } else {
                        $scope.datosUsuario.nombrePreguntaActual = preguntas[i].titulo;
                        $scope.datosUsuario.trabajoActual = preguntas[i].trabajo;
                    }
                }
            });

        });
    }

    $rootScope.$on('event:file:selected', function(event, data) {

        console.log('Se intentó subir una imagen, los datos son:');
        console.log(data.image);

        if (data.image != null) {
            API.anadirImagen({
                data: data.image,
                id_imagen: $scope.datosUsuario._id
            }, $rootScope.getToken()).success(function(data, status, headers, config) {
                $rootScope.show('Su foto de perfil ha sido cambiada con éxito');
                $window.location.reload();

            }).error(function(data, status, headers, config) {
                $rootScope.show(data.error);
            })
        }
    });

    $scope.mostrarTrabajo = function() {
        window.open($scope.elemento.file, '_system', 'location=yes');
    }

    $scope.verPerfil();
})


.controller('trabajoFinalController', function($rootScope, $scope, API, $window) {

    $scope.mostrarTrabajo = function() {
        window.open($scope.datosUsuario.trabajoActual, '_system', 'location=yes');
    }

    $rootScope.$on('event:file:selected', function(event, data) {

        if (data.trabajo != null) {
            API.subirTrabajo({
                data: data.trabajo
            }, $rootScope.getToken()).success(function(data, status, headers, config) {
                $rootScope.show('Su archivo ha sido subido con éxito.');
                API.preguntasUsuario($rootScope.getToken()).success(function(problemas) {
                    var i;
                    var preguntaBandera = false;
                    for (i = 0; i < problemas.length; i++) {
                        if (problemas[i].finalizado == false) {
                            preguntaBandera = true;
                            break;
                        }
                    }
                    if (preguntaBandera) {
                        API.reiniciarNivel(problemas[i]._id);
                    }
                });
            }).error(function(data, status, headers, config) {
                $rootScope.show(data.error);
            })
        }
    });
})

.controller('Reto1Controller', function($rootScope, $scope, API, $window) {
    $scope.res1 = '';
    $scope.res2 = '';

    $scope.respuesta = {
        respuestaCorrecta1: '',
        respuestaCorrecta2: '',
        respuesta1: '',
        respuesta2: '',
        pregunta1: '',
        pregunta2: '',
        data1: [],
        data2: []
    };

    $scope.verFormulario = function() {

        API.mostrarFormulario($rootScope.getToken()).success(function(data) {
            $scope.items = [];
            $scope.respuesta.pregunta1 = data[0].pregunta;
            $scope.respuesta.data1.push(data[0].opcionA);
            $scope.respuesta.data1.push(data[0].opcionB);
            $scope.respuesta.data1.push(data[0].opcionC);
            $scope.respuesta.data1.push(data[0].opcionD);
            $scope.respuesta.respuestaCorrecta1 = data[0].respuesta;
            $scope.respuesta.pregunta2 = data[1].pregunta;
            $scope.respuesta.data2.push(data[1].opcionA);
            $scope.respuesta.data2.push(data[1].opcionB);
            $scope.respuesta.data2.push(data[1].opcionC);
            $scope.respuesta.data2.push(data[1].opcionD);
            $scope.respuesta.respuestaCorrecta2 = data[1].respuesta;

        }).error(function(data, status, headers, config) {
            $rootScope.show(error);
        });
    }

    $scope.calificarRespuestas = function() {
        var puntaje = 0;
        if ($scope.respuesta.respuesta1 == $scope.respuesta.respuestaCorrecta1){
             puntaje++;
            $scope.res1 = "Correcto";
        }else{
            $scope.res1 = "Incorrecto";
        }
        if ($scope.respuesta.respuesta2 == $scope.respuesta.respuestaCorrecta2) {
            puntaje++;
            $scope.res2 = "Correcto"
        }else{
            $scope.res2 = "Incorrecto";
        }
        if (puntaje != 0) {
            API.puntajeReto1($rootScope.getToken(), puntaje).success(function(data) {
                $rootScope.show("Felicidades, ganaste " + puntaje + " puntos");
            }).error(function(error) {
                $rootScope.show("Ha ocurrido un error, no se agregaron los puntos obtenidos");
            });
        } else {
            $rootScope.show("No has contestado ninguna pregunta correctamente, no obtienes puntos ");
        }
    }
})

.controller('Reto2Controller', function($rootScope, $scope, API, $window) {


    $scope.missesAllowed = 5;
    var alphabet = 'abcdefghijklmnñopqrstuvwxyz';
    var words = [];
    var images = ["01.png", "02.png", "03.png", "04.png", "05.png", "06.png", "07.png"];
    $scope.play = function() {
        API.palabras($rootScope.getToken()).success(function(data) {
            var categ = data[Math.floor(Math.random() * data.length)];
            $scope.categoria = categ.categoria;
            words = categ.palabras;
            $scope.letters = makeLetters(alphabet);
            $scope.secretWord = makeLetters(getRandomWord());
            $scope.numMisses = 0;
            $scope.win = false;
            $scope.lost = false;
            $scope.image = "img/" + images[0];

        });

    }
    var getRandomWord = function() {
        return words[Math.floor(Math.random() * words.length)];
    };

    var makeLetters = function(word) {
        var wordSec = word.split('');
        var wordChose = [];
        for (var i = 0; i < wordSec.length; i++) {
            if (wordSec[i] != "-") {
                wordChose[i] = {
                    nameLetter: wordSec[i],
                    chosen: false
                };
            } else {
                wordChose[i] = {
                    nameLetter: wordSec[i],
                    chosen: true
                };
            }
        }

        return wordChose;
    };


    $scope.play();

    var checkForEndOfGame = function() {
        var allLetters = true;
        for (var i = 0; i < $scope.secretWord.length; i++) {
            if (!$scope.secretWord[i].chosen) {
                allLetters = false;
                break;
            }
        }
        if (allLetters) {
            $scope.win = true;
            $scope.image = "img/" + images[6];
            API.nuevoReto($rootScope.getToken()).success(function(data, status, headers, config) {
                $rootScope.show("Conseguiste 5 puntos");
            }).error(function(data, status, headers, config) {
                $rootScope.show("Ha ocurrido un error, por favor inténtelo más tarde");
            });
        } else {
            if ($scope.numMisses == $scope.missesAllowed) {
                $scope.lost = true;
                showWord();
            }
        }
    };

    $scope.try = function(letter) {
        console.log(letter.nameLetter);
        letter.chosen = true;
        var found = false;
        for (var i = 0; i < $scope.secretWord.length; i++) {
            if (letter.nameLetter == $scope.secretWord[i].nameLetter) {
                $scope.secretWord[i].chosen = true;
                found = true;
            }
        }
        if (found == false) {
            $scope.numMisses++;
            $scope.image = "img/" + images[$scope.numMisses];
        }
        checkForEndOfGame();

    }

    var showWord = function() {
        for (var i = 0; i < $scope.secretWord.length; i++) {
            $scope.secretWord[i].chosen = true;
        }
    }




})
