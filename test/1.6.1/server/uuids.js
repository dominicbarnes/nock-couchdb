var assert = require('assert');
var supertest = require('supertest');
var mock = require('../../..');
var status = mock.status;

module.exports = function () {
  var server = mock.server();
  var request = supertest(server.url());
  var version = server.options.version;

  afterEach(function () {
    server.mock.done();
  });

  it('should mock a successful request for a single uuid', function (done) {
    server.uuids();

    request
      .get('_uuids')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^\"[A-Z0-9]{25}\"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert.deepEqual(Object.keys(data), [ 'uuids' ]);
        assert.equal(data.uuids.length, 1);
        assert(/^[a-zA-Z0-9]{32}$/.test(data.uuids[0]));
      })
      .end(done);
  });

  it('should mock a failed request for too many uuids', function (done) {
    server.uuids({ status: status.FORBIDDEN });

    request
      .get('_uuids')
      .set('Accept', 'application/json')
      .expect(status.FORBIDDEN, {
        error:  'forbidden',
        reason: 'count parameter too large'
      })
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
