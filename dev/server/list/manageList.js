module.exports = function (server, db) {
    var validateRequest = require("../auth/validateRequest");
 
    server.get("/preguntas", function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.preguntas.find(function (err, list) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                console.log(list);
                res.end(JSON.stringify(list));
            });
        });
        return next();
    });

}