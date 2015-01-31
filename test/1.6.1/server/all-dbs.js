var assert = require('assert');
var supertest = require('supertest');
var mock = require('../../..');

module.exports = function () {
  var server = mock.server();
  var request = supertest(server.url());
  var version = server.options.version;

  afterEach(function () {
    server.mock.done();
  });

  it('should mock a successful request', function (done) {
    server.allDbs();

    request
      .get('_all_dbs')
      .expect(200)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert(Array.isArray(data));
        assert(data.length >= 1 && data.length <= 10);
        assert.equal(data[0], '_users');
        assert.equal(data[1], '_replicator');
      })
      .end(done);
  });

  it('should mock a request for a custom number of user databases', function (done) {
    server.allDbs({ count: 13 });

    request
      .get('_all_dbs')
      .expect(200)
      .expect(function (res) {
        assert.equal(res.body.length, 15);
      })
      .end(done);
  });

  it('should always include the system dbs', function (done) {
    server.allDbs({ count: 0 });

    request
      .get('_all_dbs')
      .expect(200)
      .expect(function (res) {
        assert.deepEqual(res.body, [ '_users', '_replicator' ]);
      })
      .end(done);
  });
};
