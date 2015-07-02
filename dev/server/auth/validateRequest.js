var isEmailValid = function(db, id, callback) {

    db.usuarios.findOne({
        _id: db.ObjectId(id)
    }, function(err, user) {
          callback(user);
    });
};

module.exports.validate = function(req, res, db, callback) {
    // if the request dosent have a header with email, reject the request

    if (!req.params.token) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "You are not authorized to access this application",
            message: "An Email is required as part of the header"
        }));
    };

    console.log(req.params.token);
    isEmailValid(db, req.params.token, function(user) {
        if (!user) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "You are not authorized to access this application",
                message: "Invalid User Email"
            }));
        } else {
            console.log("valida el token");
            callback();
        }
    });
};
