var assert = require('assert');
var mock = require('..');

describe('server', function () {
  it('should use a default url', function () {
    var srv = mock.server();
    assert.equal(srv.url(), 'http://localhost:5984/');
  });

  it('should use a specified url', function () {
    var srv = mock.server({ url: 'http://myapp.iriscouch.com/' });
    assert.equal(srv.url(), 'http://myapp.iriscouch.com/');
  });

  describe('1.6.1', require('./1.6.1/server'));
});
