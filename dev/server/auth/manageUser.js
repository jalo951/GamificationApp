var pwdMgr = require('./managePasswords');
var validateRequest = require("../auth/validateRequest");
var config = require("../config");

module.exports = function(server, db, nodemailer, cloudinary) {

    var base = "http://localhost:8100/#/newPassword?token=";
    //variable transporter para el acceso a la cuenta remitente
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.mailer.auth.user,
            pass: config.mailer.auth.pass
        }
    });


    //########################################################################################### 

    server.post('/registrar', function(req, res, next) {
        var user = req.params;
        db.usuarios.findOne({
            //_id: req.params._id
            email: req.params.email
        }, function(err, dbUser) {
            if (dbUser) {

                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "El usuario ya existe"
                }));
            } else {
                pwdMgr.cryptPassword(user.contrasena, function(err, hash) {
                    user.contrasena = hash;
                    db.usuarios.insert(user,
                        function(err, dbUser) {

                            if (err) {
                                res.writeHead(400, {
                                    'Content-Type': 'application/json; charset=utf-8'
                                });
                                res.end(JSON.stringify({
                                    error: err,
                                    message: "Ooops Error inesperado, por favor intente más tarde"
                                }));

                            } else {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json; charset=utf-8'
                                });
                                dbUser.contrasena = "";
                                res.end(JSON.stringify(dbUser));
                            }
                        });
                });
            }
        });
        return next();
    });



    //########################################################################################### 
    server.post('/login', function(req, res, next) {

        var user = req.params;
        if (user.email.trim().length == 0 || user.contrasena.trim().length == 0) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "Credenciales inválidas"
            }));
        }
        db.usuarios.findOne({
            //_id: req.params.email
            email: req.params.email
        }, function(err, dbUser) {

            if (!dbUser) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Usuario inválido"
                }));
            }


            pwdMgr.comparePassword(user.contrasena, dbUser.contrasena, function(err, isPasswordMatch) {


                console.log(isPasswordMatch)

                if (isPasswordMatch) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    // remove password hash before sending to the client
                    dbUser.contrasena = "";
                    res.end(JSON.stringify(dbUser));
                } else {
                    res.writeHead(403, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify({
                        error: "Contraseña Inválida"
                    }));
                }

            });
        });
        return next();
    });

    //########################################################################################### 
    server.get("/list", function(req, res, next) {
        console.log("entró al métogo get");
        validateRequest.validate(req, res, db, function() {
            db.usuarios.find({
                _id: db.ObjectId(req.params.token)
            }, function(err, list) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(list));
            });
        });
        return next();
    });



    //###############################################################################################

    server.put('/modificarDatos', function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            var user = req.params;

            db.usuarios.findOne({
                // _id: req.params.token
                _id: db.ObjectId(req.params.token)
            }, function(err, data) {
                pwdMgr.comparePassword(user.contrasena, data.contrasena, function(err, isPasswordMatch) {
                    if (isPasswordMatch) {
                        console.log('contraseñas coinciden');
                        db.usuarios.update({
                            //_id: req.params.token
                            _id: db.ObjectId(req.params.token)
                        }, {
                            $set: {
                                /* nombre: user.nombre,
                                 apellido: user.apellido,
                                 genero: user.genero*/
                                email: user.email

                            }
                        }, {
                            multi: false
                        }, function(err, data) {
                            console.log(data);
                            res.writeHead(200, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });
                            res.end(JSON.stringify(data));
                        });
                    } else {
                        res.writeHead(403, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify({
                            error: "Contraseña Inválida"
                        }));
                    }
                });
            });
        });
        return next();
    });

    //###############################################################################################################

    server.put('/modificarContrasena', function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            var user = req.params;

            console.log(user);
            db.usuarios.findOne({
                _id: db.ObjectId(req.params.token)
            }, function(err, data) {
                pwdMgr.comparePassword(user.contrasena, data.contrasena, function(err, isPasswordMatch) {
                    if (isPasswordMatch) {
                        console.log('contraseñas coinciden');

                        pwdMgr.cryptPassword(user.contrasenaNueva, function(err, hash) {
                            user.contrasenaNueva = hash;
                            db.usuarios.update({
                                _id: db.ObjectId(req.params.token)
                            }, {
                                $set: {
                                    contrasena: user.contrasenaNueva

                                }
                            }, {
                                multi: false
                            }, function(err, data) {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json; charset=utf-8'
                                });
                                res.end(JSON.stringify(data));
                            });
                        });
                    } else {
                        res.writeHead(403, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify({
                            error: "Contraseña Inválida"
                        }));
                    }
                });
            });
        });
        return next();
    });

    //#######################################################################################


    server.get('/infoUser', function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.usuarios.find({
                _id: db.ObjectId(req.params.token)
            }, function(err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });
        });
        return next();
    });
    //########################################################################################

    server.post('/resetPassword', function(req, res, next) {
        var user = req.params;
        db.usuarios.findOne({
            // _id: req.params.email
            email: req.params.email
        }, function(err, dbUser) {
            if (!dbUser) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "No existe un usuario registrado con este email"
                }));
            } else {

                var clave = makeid();
                var pToken = {
                    token: clave,
                    fechaCreacion: new Date() //Mirar restar fechas :D
                };
                db.usuarios.update({
                    _id: db.ObjectId(dbUser._id)
                }, {
                    $set: {
                        passwordToken: pToken
                    }
                }, {
                    multi: false
                }, function(err, data) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify(data));
                });

                //Enviar correo

                var mailOptions = {
                    from: config.mailer.defaultFromAddress, // sender address
                    to: dbUser.email, // list of receivers
                    subject: 'Recuperar contraseña ✔', // Subject line
                    html: config.mailer.msj + clave + config.mailer.msj2
                        //text: 'Hola, ' + dbUser.nombre + ', con este correo podrás reestablecer tu password.'
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }
        });
        return next();

    });

    //#################################################################################################################
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    //############################################################################################################

    server.post('/newPassword', function(req, res, next) {
        var user = req.params;
        //console.log("in");
        db.usuarios.findOne({
            // _id: req.params.email
            _id: db.ObjectId(req.params.id)
        }, function(err, dbUser) {

            if (!dbUser) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "No existe un usuario registrado con este email"
                }));
            } else {
                pwdMgr.cryptPassword(user.contrasena, function(err, hash) {
                    user.contrasena = hash;
                    db.usuarios.update({
                        _id: db.ObjectId(dbUser._id)
                    }, {
                        $set: {
                            contrasena: user.contrasena
                        }
                    }, {
                        multi: false
                    }, function(err, data) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify(data));
                    });
                });
            }
        });
        return next();

    });

    //########################################################################################

    server.post('/codigo', function(req, res, next) {
        var user = req.params;
        //console.log("in");
        db.usuarios.findOne({
            // _id: req.params.email
            "passwordToken.token": req.params.token
        }, function(err, dbUser) {

            if (!dbUser) {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Código incorrecto"
                }));
            } else {
                var fecha = dbUser.passwordToken.fechaCreacion;
                var fechaAct = new Date();
                var tiempo = (fechaAct - fecha) / 1000;
                db.usuarios.update({
                    _id: db.ObjectId(dbUser._id)
                }, {
                    $unset: {
                        passwordToken: 1
                    }
                }, {
                    multi: false
                }, function(err, data) {
                    if (tiempo < 300) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify(dbUser));
                    } else {
                        res.writeHead(403, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify({
                            error: "Su Código ha expirado, por favor genere uno nuevo"
                        }));

                    }

                });

            }

        });
        return next();

    });

    //########################################################################################

    server.post("/subirTrabajo", function(req, res, next) {
        var trabajo = req.params;

        /*
                cloudinary.uploader.upload("my_file_name.docx",
                    function(result) { console.log(result); },
                    {
                        public_id: "sample_document.docx",
                        resource_type: "auto",
                        raw_convert: "aspose"
                    });
        */

        validateRequest.validate(req, res, db, function() {


            cloudinary.uploader.upload(trabajo.data, function(result) {

                db.preguntas.find({
                    $or: [{
                        miembros_id: db.ObjectId(req.params.token)
                    }, {
                        autor_id: db.ObjectId(req.params.token)
                    }]
                }, function(err, problema) {

                    console.log('-----------------------------------');
                    console.log(problema[0]._id);
                    db.preguntas.update({
                        _id: db.ObjectId(problema[0]._id)
                    }, {
                        $set: {
                            trabajo: result.url
                        }
                    }, {
                        multi: false
                    }, function(err, data) {
                        console.log(result);
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify(result));
                    })
                });

            }, {
                resource_type: "auto",
                raw_convert: "aspose"
            });
        });


        return next();
    });


    //##########################################################################################
    server.post("/anadirImagen", function(req, res, next) {
        var imagen = req.params;

        cloudinary.uploader.upload(imagen.data, function(result) {
            db.usuarios.update({
                _id: db.ObjectId(req.params.token)
            }, {
                $set: {
                    foto: result.url
                }
            }, {
                multi: false
            }, function(err, data) {
                console.log(result);
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(result));
            })
        }, {
            public_id: req.params.token,
            width: 200,
            height: 200,
            crop: 'scale',
            radius: 'max'
        });
        return next();
    });


    //##########################################################################################

    server.get('/cargarImagen', function(req, res, next) {

        data = cloudinary.image(req.params.token, {
            alt: "Sample Image"
        });

        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));

        return next();
    });

    //####################################################################################################

    server.get('/eliminarImagen', function(req, res, next) {

        cloudinary.uploader.destroy(req.params.token, function(result) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });

        return next();
    });



    //####################################################################################################

    server.get('/cambiarNivel', function(req, res, next) {
        db.preguntas.findOne({
            _id: db.ObjectId(req.params._id)
        }, function(err, data) {
            if (data.miembros_id.length == 2) {
               db.usuarios.update({
                   _id: db.ObjectId(data.autor_id)
               }, {
                   $inc: {
                       nivel: 1
                   }
               }, {
                   multi: false
               }, function(err, autor) {





                   db.usuarios.findOne({
                       _id: db.ObjectId(data.autor_id)
                   }, function(err, author) {

                       //Enviar correo notificando subir nivel%

                       //Destinatarios
                       console.log("Enviando correo a: ", author.email);


                       var opciones = {
                           from: config.mailer.defaultFromAddress, // sender address
                           to: author.email, // list of receivers
                           subject: 'Recuperar contraseña ✔', // Subject line
                           html: '¡Enhorabuena! Tú y tus compañeros de equipo han subido de nivel'
                               //text: 'Hola, ' + dbUser.nombre + ', con este correo podrás reestablecer tu password.'
                       };

                       transporter.sendMail(opciones, function(error, info) {
                           if (error) {
                               console.log(error);
                           } else {
                               console.log('Message sent: ' + info.response);
                           }
                       });

                       //Enviar correo notificando subir nivel%

                       res.writeHead(200, {
                           'Content-Type': 'application/json; charset=utf-8'
                       });
                       res.end(JSON.stringify(author));



                   });







                   res.writeHead(200, {
                       'Content-Type': 'application/json; charset=utf-8'
                   });
                   res.end(JSON.stringify(autor));
               });





               db.usuarios.update({
                   _id: db.ObjectId(data.miembros_id[0])
               }, {
                   $inc: {
                       nivel: 1
                   }
               }, {
                   multi: false
               }, function(err, miembro) {
                   db.usuarios.findOne({
                       _id: db.ObjectId(data.miembros_id[0])
                   }, function(err, member) {


                       //Enviar correo notificando subir nivel%

                       //Destinatarios
                       //console.log("Enviando correo a: ", member.email);


                       var opciones = {
                           from: config.mailer.defaultFromAddress, // sender address
                           to: member.email, // list of receivers
                           subject: 'Recuperar contraseña ✔', // Subject line
                           html: '¡Enhorabuena! Tú y tus compañeros de equipo han subido de nivel'
                               //text: 'Hola, ' + dbUser.nombre + ', con este correo podrás reestablecer tu password.'
                       };

                       transporter.sendMail(opciones, function(error, info) {
                           if (error) {
                               console.log(error);
                           } else {
                               console.log('Message sent: ' + info.response);
                           }
                       });

                       //Enviar correo notificando subir nivel%

                       res.writeHead(200, {
                           'Content-Type': 'application/json; charset=utf-8'
                       });
                       res.end(JSON.stringify(author));



                   });

                   res.writeHead(200, {
                       'Content-Type': 'application/json; charset=utf-8'
                   });
                   res.end(JSON.stringify(miembro));

               });


               db.usuarios.update({
                   _id: db.ObjectId(data.miembros_id[1])
               }, {
                   $inc: {
                       nivel: 1
                   }
               }, {
                   multi: false
               }, function(err, miembro2) {
                   db.usuarios.findOne({
                       _id: db.ObjectId(data.miembros_id[1])
                   }, function(err, member2) {


                       //Enviar correo notificando subir nivel%

                       //Destinatarios
                       console.log("Enviando correo a: ", member2.email);


                       var opciones = {
                           from: config.mailer.defaultFromAddress, // sender address
                           to: member2.email, // list of receivers
                           subject: 'Recuperar contraseña ✔', // Subject line
                           html: '¡Enhorabuena! Tú y tus compañeros de equipo han subido de nivel'
                               //text: 'Hola, ' + dbUser.nombre + ', con este correo podrás reestablecer tu password.'
                       };

                       transporter.sendMail(opciones, function(error, info) {
                           if (error) {
                               console.log(error);
                           } else {
                               console.log('Message sent: ' + info.response);
                           }
                       });

                       //Enviar correo notificando subir nivel%

                       res.writeHead(200, {
                           'Content-Type': 'application/json; charset=utf-8'
                       });
                       res.end(JSON.stringify(miembro2));
                   });

                   res.writeHead(200, {
                       'Content-Type': 'application/json; charset=utf-8'
                   });
                   res.end(JSON.stringify(miembro2));

               });
            }

            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });

        return next();
    });


    //###########################################################################

    server.get("/irTercerNivel", function(req, res, next) {
        var banderaAutor = false;
        var banderaM1 = false;
        var banderaM2 = false;


        db.preguntas.findOne({
            _id: db.ObjectId(req.params.problema_id)
        }, function(err, dato) {
            if (dato) {
                db.objetivos.find({
                    problema_id: db.ObjectId(req.params.problema_id)
                }, function(err, objetivos) {

                    if (objetivos) {
                        db.usuarios.findOne({
                            _id: db.ObjectId(dato.autor_id)
                        }, function(err, autor) {

                            if (autor.creacionObjetivo && autor.voto) {
                                banderaAutor = true;
                            }
                            db.usuarios.findOne({
                                _id: db.ObjectId(dato.miembros_id[0])
                            }, function(err, autor1) {
                                if (autor1.creacionObjetivo && autor1.voto) {
                                    banderaM1 = true;
                                }
                                db.usuarios.findOne({
                                    _id: db.ObjectId(dato.miembros_id[1])
                                }, function(err, autor2) {
                                    if (autor2.creacionObjetivo && autor2.voto) {
                                        banderaM2 = true;
                                    }
                                    console.log("funciona bandera");
                                    console.log(banderaM1);
                                    if (banderaM1 && banderaAutor && banderaM2) {
                                        //#############################################################################################
                                        db.usuarios.update({
                                            _id: db.ObjectId(dato.autor_id)
                                        }, {
                                            $inc: {
                                                nivel: 1
                                            }
                                        }, {
                                            multi: false
                                        }, function(err, autor) {





                                            db.usuarios.findOne({
                                                _id: db.ObjectId(dato.autor_id)
                                            }, function(err, author) {

                                                //Enviar correo notificando subir nivel%

                                                //Destinatarios
                                                console.log("Enviando correo a: ", author.email);


                                                var opciones = {
                                                    from: config.mailer.defaultFromAddress, // sender address
                                                    to: author.email, // list of receivers
                                                    subject: 'Recuperar contraseña ✔', // Subject line
                                                    html: '¡Enhorabuena! Tú y tus compañeros de equipo han subido de nivel'
                                                        //text: 'Hola, ' + dbUser.nombre + ', con este correo podrás reestablecer tu password.'
                                                };

                                                transporter.sendMail(opciones, function(error, info) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {
                                                        console.log('Message sent: ' + info.response);
                                                    }
                                                });

                                                //Enviar correo notificando subir nivel%

                                                res.writeHead(200, {
                                                    'Content-Type': 'application/json; charset=utf-8'
                                                });
                                                res.end(JSON.stringify(author));



                                            });







                                            res.writeHead(200, {
                                                'Content-Type': 'application/json; charset=utf-8'
                                            });
                                            res.end(JSON.stringify(autor));
                                        });





                                        db.usuarios.update({
                                            _id: db.ObjectId(dato.miembros_id[0])
                                        }, {
                                            $inc: {
                                                nivel: 1
                                            }
                                        }, {
                                            multi: false
                                        }, function(err, miembro) {
                                            db.usuarios.findOne({
                                                _id: db.ObjectId(dato.miembros_id[0])
                                            }, function(err, member) {


                                                //Enviar correo notificando subir nivel%

                                                //Destinatarios
                                                //console.log("Enviando correo a: ", member.email);


                                                var opciones = {
                                                    from: config.mailer.defaultFromAddress, // sender address
                                                    to: member.email, // list of receivers
                                                    subject: 'Recuperar contraseña ✔', // Subject line
                                                    html: '¡Enhorabuena! Tú y tus compañeros de equipo han subido de nivel'
                                                        //text: 'Hola, ' + dbUser.nombre + ', con este correo podrás reestablecer tu password.'
                                                };

                                                transporter.sendMail(opciones, function(error, info) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {
                                                        console.log('Message sent: ' + info.response);
                                                    }
                                                });

                                                //Enviar correo notificando subir nivel%

                                                res.writeHead(200, {
                                                    'Content-Type': 'application/json; charset=utf-8'
                                                });
                                                res.end(JSON.stringify(author));



                                            });

                                            res.writeHead(200, {
                                                'Content-Type': 'application/json; charset=utf-8'
                                            });
                                            res.end(JSON.stringify(miembro));

                                        });


                                        db.usuarios.update({
                                            _id: db.ObjectId(dato.miembros_id[1])
                                        }, {
                                            $inc: {
                                                nivel: 1
                                            }
                                        }, {
                                            multi: false
                                        }, function(err, miembro2) {
                                            db.usuarios.findOne({
                                                _id: db.ObjectId(dato.miembros_id[1])
                                            }, function(err, member2) {


                                                //Enviar correo notificando subir nivel%

                                                //Destinatarios
                                                console.log("Enviando correo a: ", member2.email);


                                                var opciones = {
                                                    from: config.mailer.defaultFromAddress, // sender address
                                                    to: member2.email, // list of receivers
                                                    subject: 'Recuperar contraseña ✔', // Subject line
                                                    html: '¡Enhorabuena! Tú y tus compañeros de equipo han subido de nivel'
                                                        //text: 'Hola, ' + dbUser.nombre + ', con este correo podrás reestablecer tu password.'
                                                };

                                                transporter.sendMail(opciones, function(error, info) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {
                                                        console.log('Message sent: ' + info.response);
                                                    }
                                                });

                                                //Enviar correo notificando subir nivel%

                                                res.writeHead(200, {
                                                    'Content-Type': 'application/json; charset=utf-8'
                                                });
                                                res.end(JSON.stringify(miembro2));
                                            });

                                            res.writeHead(200, {
                                                'Content-Type': 'application/json; charset=utf-8'
                                            });
                                            res.end(JSON.stringify(miembro2));

                                        });
                                        //######################################################################################################
                                    } else {
                                        res.writeHead(403, {
                                            'Content-Type': 'application/json; charset=utf-8'
                                        });
                                        res.end(JSON.stringify({
                                            error: "error"
                                        }));
                                    }
                                });

                            });

                        });
                    }

                });
            }
        });

        return next();
    });
    //#########################################################################################
    server.get('/reiniciarNivel', function(req, res, next) {

        db.preguntas.update({
            _id: db.ObjectId(req.params.pregunta_id)
        }, {
            $set: {
                finalizado: true
            }
        }, function(err, data) {
            db.preguntas.findOne({
                _id: db.ObjectId(req.params.pregunta_id)
            }, function(err, preg) {
                if (preg) {
                    db.usuarios.update({
                        _id: db.ObjectId(preg.autor_id)
                    }, {
                        $set: {
                            nivel: 1,
                            creacionObjetivo:false,
                            voto: false
                        }
                    }, function(err, usuario) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify(usuario));
                    });
                    db.usuarios.update({
                        _id: db.ObjectId(preg.miembros_id[0])
                    }, {
                        $set: {
                           nivel: 1,
                            creacionObjetivo:false,
                            voto: false
                        }
                    }, function(err, usuario1) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify(usuario1));
                    });
                    db.usuarios.update({
                        _id: db.ObjectId(preg.miembros_id[1])
                    }, {
                        $set: {
                            nivel: 1,
                            creacionObjetivo:false,
                            voto: false
                        }
                    }, function(err, usuario2) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify(usuario2));
                    });
                } else {
                    res.writeHead(403, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify({
                        error: "error"
                    }));
                }

            });
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));

        });

        return next();
    });
    //########################################################################################

};
