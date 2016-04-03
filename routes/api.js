var express = require('express');
var router = express.Router();

/* Process emails. */
router.post('/process', function(req, res, next) {
  res.send({});
});

module.exports = router;
