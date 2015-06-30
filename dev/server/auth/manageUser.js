var pwdMgr = require('./managePasswords');
var validateRequest = require("../auth/validateRequest");

module.exports = function(server, db) {


    //########################################################################################### 

    server.post('/registrar', function(req, res, next) {
        var user = req.params;
        db.usuarios.findOne({
            //_id: req.params._id
            email: req.params.email
        }, function(err, dbUser) {
            console.log(dbUser);
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
                    console.log("n", hash);
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

        console.log('Server login')
        console.log(req.params.email)
        console.log(req.params.contrasena)


        var user = req.params;
        if (user.email.trim().length == 0 || user.contrasena.trim().length == 0) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "Credenciales inválidas"
            }));
        }
        console.log("in");
        db.usuarios.findOne({
            //_id: req.params.email
            email : req.params.email
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

            console.log(user);
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

  
server.get('/infoUser', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.usuarios.find({
                 _id: db.ObjectId(req.params.token)
            }, function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });
        });
        return next();
    });
//########################################################################################

};
