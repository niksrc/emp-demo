var ctxio = require('contextio');

var env = process.env;

module.exports = new ctxio.Client('2.0', {
  key: env.CONSUMER_KEY,
  secret: env.CONSUMER_SECRET
});
