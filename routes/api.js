var express = require('express');
var emp = require('../lib/emp');
var router = express.Router();
var ctx = require('../lib/ctxapi');

/* Process emails. */
router.post('/process', function(req, res, next) {
  	var userid = req.body.userid;
  	var msgid = req.body.msgid;

		ctx.accounts(userid).messages(msgid).body().get(function (err, response) {
			if(err)
				throw err;
			res.send(response);
		});
});

module.exports = router;
