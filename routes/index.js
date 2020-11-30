var express = require('express');
var router = express.Router();
const logger = require('morgan');

const CLH = require('../services/codelighthouse.service');
const CodeLighthouse = new CLH.CodeLighthouse(
	'Secret Corp',
	process.env['CODELIGHTHOUSE_SECRET'],
	resource_group = "Web Apps",
	resource_name = "Example App",
	dev = true
)
/* GET home page. */
router.get('/', function (req, res, next) {
	console.log('route');

	res.render('index', {title: 'Express'});

});

router.get('/error', (request, response, next) => {
	console.log('route');
	try {
		res.render('index', {title: 'Express'});
	} catch (err) {
		CodeLighthouse.error(err, 'kmistele@protonmail.com');

		// OTHER ERROR HANDLING CODE HERE
		response.send("error caught!");
	}
})

module.exports = router;
