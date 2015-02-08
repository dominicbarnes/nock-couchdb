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

  it('should mock a successful view cleanup', function (done) {
    database.viewCleanup();

    request
      .post('_view_cleanup')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(status.ACCEPTED, { ok: true })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failure because of invalid name', function (done) {
    database.viewCleanup({ error: status.BAD_REQUEST });

    request
      .post('_view_cleanup')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(status.BAD_REQUEST, {
        error:  'illegal_database_name',
        reason: 'Name: \'test\'. Only lowercase characters (a-z), digits (0-9), and any of the characters _, $, (, ), +, -, and / are allowed. Must begin with a letter.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failure because of security restrictions', function (done) {
    database.viewCleanup({ error: status.UNAUTHORIZED });

    request
      .post('_view_cleanup')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
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

  it('should mock a failure because content type is invalid', function (done) {
    database.viewCleanup({ error: status.UNSUPPORTED_MEDIA_TYPE });

    request
      .post('_view_cleanup')
      .set('Accept', 'application/json')
      .expect(status.UNSUPPORTED_MEDIA_TYPE, JSON.stringify({
        error:  'bad_content_type',
        reason: 'Content-Type must be application/json'
      }))
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failure due to missing db', function (done) {
    database.viewCleanup({ error: status.NOT_FOUND });

    request
      .post('_view_cleanup')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(status.NOT_FOUND, {
        error:  'not_found',
        reason: 'no_db_file'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
