var assert = require('assert');
var supertest = require('supertest');
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

  describe('server.info()', function () {
    var server = mock.server();
    var request = supertest(server.url());

    afterEach(function () {
      server.mock.done();
    });

    it('should mock the root endpoint', function (done) {
      server.info();
      var version = server.options.version;

      request
        .get('')
        .expect(200)
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Length', /^\d+$/)
        .expect('Date', server.options.date.toUTCString())
        .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
        .expect(function (res) {
          assert.equal(res.body.couchdb, 'Welcome');
          assert.equal(res.body.version, version);
        })
        .end(done);
    });
  });
});
