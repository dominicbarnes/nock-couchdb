var assert = require('assert');
var supertest = require('supertest');
var mock = require('../../..');
var status = mock.status;

module.exports = function () {
  var server = mock.server();
  var database = server.database('test');
  var document = database.designDocument('test');
  var request = supertest(document.url());
  var version = server.options.version;

  afterEach(function () {
    document.done();
  });

  it('should mock a successful delete', function (done) {
    document.delete();

    request
      .delete('')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert.strictEqual(data.ok, true);
        assert.equal(data.id, '_design/test');
        assert(data.rev);
      })
      .end(done);
  });

  it('should mock a failure because of invalid rev', function (done) {
    document.delete({ status: status.BAD_REQUEST });

    request
      .delete('')
      .set('Accept', 'application/json')
      .expect(status.BAD_REQUEST, {
        error:  'bad_request',
        reason: 'Invalid rev format.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failure because of security restrictions', function (done) {
    document.delete({ status: status.UNAUTHORIZED });

    request
      .delete('')
      .set('Accept', 'application/json')
      .expect(status.UNAUTHORIZED, {
        error:  'unauthorized',
        reason: 'You are not authorized to access this db.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failure because the database does not exist', function (done) {
    document.delete({ status: status.NOT_FOUND });

    request
      .delete('')
      .set('Accept', 'application/json')
      .expect(status.NOT_FOUND, {
        error:  'not_found',
        reason: 'missing'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
