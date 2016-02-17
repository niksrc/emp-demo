var express = require('express');
var ms = require('time-ago')();
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

router.get('/users/:id', function(req, res, next) {
	var userid = req.params.id;
	var options = req.query;

	ctx.accounts(userid).messages().get({callback_url:callback_url}, function (err, response) {
	    var messages = [];
	    if (err) throw err;
	    messages = response.body
	    	.map(function (msg) {
	    		msg.from = {};
	    		msg.from.name = msg.addresses.from.name;
	    		msg.from.email = msg.addresses.from.email;
	    		msg.from.avatar = msg.person_info[msg.from.email].thumbnail;
	    		msg.date = ms.ago(new Date(+msg.date * 1000));
	    		return msg;
	    	})
	    res.render('console', {messages: messages, title: 'console'});
	});
});

router.get('/users/:id/messages/:msgid', function(req, res, next) {
	var userid = req.params.id;
	var msgid = req.params.msgid;
	var options = req.query;

	ctx.accounts(userid).messages(msgid).body({type: 'text/html'}).get(function (err, response) {
		if(err)
			throw err;
    res.send(response);
	});
});

module.exports = router;
