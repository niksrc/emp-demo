var express = require('express');
var emp = require('../lib/emp');
var router = express.Router();

/* Process emails. */
router.post('/process', function(req, res, next) {
  var result = emp.process(JSON.stringify(req.body));
  res.send(result);
});

module.exports = router;
