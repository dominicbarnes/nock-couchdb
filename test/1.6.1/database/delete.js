var assert = require('assert');
var supertest = require('supertest');
var mock = require('../../..');
var status = mock.status;

module.exports = function () {
  var server = mock.server();
  var database = server.database('test');
  var request = supertest(database.url());
  var version = server.options.version;

  afterEach(function () {
    database.done();
  });

  it('should mock a successful delete', function (done) {
    database.delete();

    request
      .delete('')
      .set('Accept', 'application/json')
      .expect(status.OK, { ok: true })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failure because of added ?rev= param', function (done) {
    database.delete({ status: status.BAD_REQUEST });

    request
      .delete('')
      .set('Accept', 'application/json')
      .expect(status.BAD_REQUEST, {
        error:  'bad_request',
        reason: 'You tried to DELETE a database with a ?rev= parameter. Did you mean to DELETE a document instead?'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failure because of security restrictions', function (done) {
    database.delete({ status: status.UNAUTHORIZED });

    request
      .delete('')
      .set('Accept', 'application/json')
      .expect(status.UNAUTHORIZED, {
        error:  'unauthorized',
        reason: 'You are not a server admin.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failure because the database does not exist', function (done) {
    database.delete({ status: status.NOT_FOUND });

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
