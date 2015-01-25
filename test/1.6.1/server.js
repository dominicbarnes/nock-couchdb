var assert = require('assert');
var supertest = require('supertest');
var mock = require('../..');

module.exports = function () {
  describe('.info()', function () {
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
};
