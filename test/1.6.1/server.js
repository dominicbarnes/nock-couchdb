var assert = require('assert');
var supertest = require('supertest');
var mock = require('../..');

module.exports = function () {
  var server = mock.server();
  var request = supertest(server.url());
  var version = server.options.version;

  afterEach(function () {
    server.mock.done();
  });

  describe('.info()', function () {
    it('should mock the root endpoint', function (done) {
      server.info();

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

  describe('.activeTasks([count])', function () {
    it('should mock the active tasks endpoint', function (done) {
      server.activeTasks();

      request
        .get('_active_tasks')
        .expect(200)
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Length', /^\d+$/)
        .expect('Date', server.options.date.toUTCString())
        .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
        .expect(function (res) {
          var data = res.body;
          assert(Array.isArray(data));
          assert(data.length >= 1 && data.length <= 10);
          assert(data[0].type);
        })
        .end(done);
    });

    it('should allow setting a custom number of tasks', function (done) {
      server.activeTasks(15);

      request
        .get('_active_tasks')
        .expect(200)
        .expect(function (res) {
          assert.equal(res.body.length, 15);
        })
        .end(done);
    });
  });
};
