var express = require('express');
var router = express.Router();
var ctx = require('../lib/ctxapi');
var callback_url = 'http://127.0.0.1:3000'

/* GET home page. */
router.get('/', function(req, res, next) {
	ctx.accounts().get({limit:15}, function (err, response) {
	    if (err) throw err;
  		console.log(JSON.stringify(response.body));
  		res.render('index', { users: response.body, title: 'EMP demo' });
	});
});

router.get('/users/new', function(req, res, next) {
	ctx.connectTokens().post({callback_url:callback_url}, function (err, response) {
	    if (err) throw err;
	    console.log(response);
	    res.redirect(response.body.browser_redirect_url);
	});
});

module.exports = router;
