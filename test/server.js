var assert = require('assert');
var supertest = require('supertest');
var mock = require('..');

describe('server(url)', function () {
  it('should use a default url', function () {
    var srv = mock.server();
    assert.equal(srv.base, 'http://localhost:5984/');
  });

  it('should use a specified url', function () {
    var srv = mock.server('http://myapp.iriscouch.com/');
    assert.equal(srv.base, 'http://myapp.iriscouch.com/');
  });

  describe('server.info([version])', function () {
    var server = mock.server();
    var request = supertest(server.base);

    afterEach(function () {
      assert(server.done());
      server.clean();
    });

    it('should mock the root endpoint', function (done) {
      server.info();

      request
        .get('')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          assert.equal(res.body.couchdb, 'Welcome');
          assert(/\d\.\d\.\d/.test(res.body.version));
          done();
        });
    });

    it('should set a custom version number', function (done) {
      server.info('1.2.3');

      request
        .get('')
        .expect(200, {
          couchdb: 'Welcome',
          version: '1.2.3'
        })
        .end(done);
    });
  });
});
