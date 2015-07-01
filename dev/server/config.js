//'use strict';

module.exports = {
	mailer: {
		auth: {
			user: 'jcsudea@gmail.com',
			pass: '****' //Ustedes saben cual es
		},
		defaultFromAddress: 'Gamification App ✔ <jcsudea@gmail.com>',
		msj: '<body style="width:600px"><img src="http://irontec.github.io/slides-wpion/images/ionic.png">' +
			'<blockquote><p><font size=4 color="#626262"face = "arial, verdana, helvetica">Para restablecer tu contraseña, ' +
			'dirígite a este <a href= "http://localhost:8100/#/insertarCodigo">link</a> e ingresa el código de la tabla' +
			' respetando las mayúsculas y minúsculas:</font></p><div style="text-align:center;">' +
			'<table width = "150" cellspacing = "2" cellpadding = "6" border = "0" bgcolor = "#1E679A" style="margin: 0 auto; text-align:center;">' +
			' <tr> <td> <font size=4 color = "#FFFFFF" face = "arial, verdana, helvetica"> <b> Código </b></font></td></tr><tr> <td bgcolor = "#ffffcc"> ' +
			'<font face = "arial, verdana, helvetica" size=6><b>',
		msj2: '</b></font></td></tr></table></div></blockquote>'
	}
};
