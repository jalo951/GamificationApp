module.exports = function(server, db) {
    var validateRequest = require("../auth/validateRequest");

    server.get("/preguntasForm1", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.retos.find({reto : 1},function(err, list) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(list));
            });
        });
        return next();
    });

    server.get("/reto1", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
        	console.log(req.params.token);
        	console.log(req.params.puntaje);
            db.usuarios.update({
                _id: db.ObjectId(req.params.token)
            }, {
                $inc: {
                    puntos: parseInt(req.params.puntaje)
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

    server.get("/palabrasReto2", function(req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.retos.find({reto : 2},function(err, list) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(list));
            });
        });
        return next();
    });

 }