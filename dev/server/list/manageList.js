module.exports = function(server, db) {
    var validateRequest = require("../auth/validateRequest");

    server.get("/preguntas", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.preguntas.find(function(err, list) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(list));
            });
        });
        return next();
    });
    //#####################################################################
    server.get("/verificarPregunta", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            var bandera = false;
            db.preguntas.find({
                    $or: [{
                        miembros_id: db.ObjectId(req.params.token)
                    }, {
                        autor_id: db.ObjectId(req.params.token)
                    }]
                },
                function(err, datos) {

                    if (datos.length == 0) {
                        bandera = true;

                    } else {
                        bandera = true;

                        for (var i = 0; i < datos.length; i++) {
                            if (datos[i].finalizado == false) {
                                bandera = false;
                                break;
                            }
                        }

                    }
                    if (bandera) {

                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify({
                            message: "El usuario puede publicar una pregunta"
                        }));

                    } else {

                        res.writeHead(403, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify({
                            error: "El usuario tiene investigaciones en curso"
                        }));
                    }

                });
        });
        return next();
    });

    //##########################################################################################
    server.post("/anadirPregunta", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            var pregunta = req.params;

            db.preguntas.insert({
                    titulo: pregunta.titulo,
                    descripcion: pregunta.descripcion,
                    fechaLimite: new Date(pregunta.fechaLimite),
                    autor_id: db.ObjectId(pregunta.token),
                    miembros_id: [],
                    finalizado: false
                },
                function(err, dbPregunta) {

                    if (err) {
                        res.writeHead(400, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify({
                            error: err,
                            message: "Ooops Error inesperado, por favor intente más tarde"
                        }));

                    } else {

                        db.usuarios.update({
                            _id: db.ObjectId(req.params.token)
                        }, {
                            $inc: {
                                puntos: 15
                            }
                        }, function(err, data) {
                            res.writeHead(200, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });
                            res.end(JSON.stringify(data));
                        });

                    }
                });
        });
        return next();
    });
    //####################################################################################################
    server.post("/unirseProblema", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {

            db.preguntas.findOne({
                _id: db.ObjectId(req.params._id)
            }, function(err, problema) {

                if (problema) {
                    if (problema.miembros_id.length < 2) {
                        db.preguntas.update({
                            _id: db.ObjectId(req.params._id)
                        }, {
                            $addToSet: {
                                miembros_id: db.ObjectId(req.params.token)

                            }
                        }, {
                            multi: false
                        }, function(err, data) {
                            db.usuarios.update({
                                _id: db.ObjectId(req.params.token)
                            }, {
                                $inc: {
                                    puntos: 10
                                }
                            }, function(err, data) {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json; charset=utf-8'
                                });
                                res.end(JSON.stringify(data));
                            });
                        });
                    } else {
                        res.writeHead(400, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify({
                            error: "El problema ya tiene 2 usuarios unidos"
                        }));

                    }
                }
            });
        });
        return next();
    });

    //####################################################################################################    

    server.get("/nuevoReto", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.usuarios.update({
                _id: db.ObjectId(req.params.token)
            }, {
                $inc: {
                    puntos: 5
                }
            }, function(err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });
        });
        return next();
    });

    //#######################################################################################################

    server.get("/verObjetivos", function(req, res, next) {
        db.objetivos.find({
            problema_id: db.ObjectId(req.params._idProblema)
        }, function(err, list) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });

            res.end(JSON.stringify(list));
        });

        return next();
    });
    //###############################################################################################

    server.post("/votarObjetivo", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.objetivos.findOne({
                _id: db.ObjectId(req.params._id)
            }, function(err, objetivo) {
                db.objetivos.update({
                    _id: db.ObjectId(req.params._id)
                }, {
                    $inc: {
                        votos: req.params.votos
                    },
                    $addToSet: {
                        votantes: db.ObjectId(req.params.token)
                    }
                }, function(err, data) {

                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify(data));
                });

                db.usuarios.update({
                    _id: db.ObjectId(req.params.token)
                }, {

                    $set: {
                        voto: true
                    }
                }, function(err, usuario) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify(usuario));
                });

            });
        });
        return next();
    });

    //###################################################################################################

    server.get("/eliminarPreguntas", function(req, res, next) {

        var fecha = new Date();
        db.preguntas.remove({
            fechaLimite: {
                $lte: new Date()
            }
        }, function(err, list) {

            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            console.log(list);
            res.end(JSON.stringify(list));
        });

        return next();
    });

    //##################################################################################################
    server.post("/nuevoObjetivo", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.objetivos.insert({
                descripcion: req.params.descripcion,
                autor_id: db.ObjectId(req.params.token),
                problema_id: db.ObjectId(req.params.problema_id),
                votos: 0,
                votantes: []
            }, function(err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });

            db.usuarios.update({
                _id: db.ObjectId(req.params.token)
            }, {
                $inc: {
                    puntos: 2
                },
                $set: {
                    creacionObjetivo: true
                }
            }, function(err, usuario) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(usuario));
            });
        });
        return next();
    });
    //######################################################################################################
    server.get("/verificarVotacion", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.objetivos.findOne({
                _id: db.ObjectId(req.params._id)
            }, function(err, data) {
                if ((data.autor_id == req.params.token) || (data.votantes[0] == req.params.token) || (data.votantes[1] == req.params.token)) {
                    res.writeHead(403, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify({
                        error: "No puedes votar nuevamente por este objetivo"
                    }));
                } else {

                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify({
                        message: "El usuario puede votar "
                    }));
                }
            });


        });
        return next();
    });

    //###########################################################################################################
    server.get("/listarPreguntasUsuario", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.preguntas.find({
                    $or: [{
                        miembros_id: db.ObjectId(req.params.token)
                    }, {
                        autor_id: db.ObjectId(req.params.token)
                    }]
                },
                function(err, datos) {

                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });

                    res.end(JSON.stringify(datos));
                });
        });
        return next();
    });

    //#######################################################################################################



}
