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
    server.done();
  });

  it('should mock a successful create', function (done) {
    database.create();

    request
      .put('')
      .set('Accept', 'application/json')
      .expect(status.CREATED, { ok: true })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failure because of invalid name', function (done) {
    database.create({ error: status.BAD_REQUEST });

    request
      .put('')
      .set('Accept', 'application/json')
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
    database.create({ error: status.UNAUTHORIZED });

    request
      .put('')
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

  it('should mock a failure because the database already exists', function (done) {
    database.create({ error: status.PRECONDITION_FAILED });

    request
      .put('')
      .set('Accept', 'application/json')
      .expect(status.PRECONDITION_FAILED, {
        error:  'file_exists',
        reason: 'The database could not be created, the file already exists.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
