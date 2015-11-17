var assert = require('assert');
require('dotenv').load();

var api = require('../lib/ctxapi');


describe('Context.IO', function() {
  this.timeout(0);

  it('should connect to server', function(done){    
    api.accounts().get({}, function(err,response){
      done(err);
    })
  })
})