var restify     =   require('restify');
var mongojs     =   require('mongojs');
var morgan      =   require('morgan');
var db          =   mongojs('mongodb://root:root@ds061391.mongolab.com:61391/integrador', ['usuarios', 'retos', 'preguntas', 'objetivos']);
var server      =   restify.createServer();
var nodemailer 	=	require('nodemailer');
var config		=	require('./config')
var cloudinary 	= 	require('cloudinary');

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(morgan('dev')); // LOGGER
 
// CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
 
server.listen(process.env.PORT || 9804, function () {
    console.log("Server started @ ",process.env.PORT || 9804);
});

//var manageUsers = require('./auth/manageUser');

cloudinary.config({ 
	cloud_name: config.cloud.cloud_name, 
	api_key: config.cloud.api_key, 
	api_secret: config.cloud.api_secret 
});

var manageUsers = require('./auth/manageUser')(server, db, nodemailer, cloudinary);
var manageLists = require('./list/manageList')(server, db);
var manageRanking = require('./ranking/manageRanking')(server,db);