var express = require('express');
var emp = require('../lib/emp');
var router = express.Router();
var ctx = require('../lib/ctxapi');
var emailtext = require('../lib/emailtext');

/* Process emails. */
router.post('/process', function(req, res, next) {
  	var userid = req.body.userid;
  	var msgid = req.body.msgid;

		ctx.accounts(userid).messages(msgid).get({include_body: 1}, function (err, email) {
			if(err)
				throw err;

			var text = emailtext(email.body);
			emp.process(email.body, text.join(), function(result) {
				res.send(result);
			})
		});
});

module.exports = router;
