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
    server.restart();

    request
      .post('_restart')
      .expect(202, { ok: true })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock an authentication failure', function (done) {
    server.restart({ error: 403 });

    request
      .post('_restart')
      .expect(403, {
        error:  'unauthorized',
        reason: 'You are not a server admin.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a content-type failure', function (done) {
    server.restart({ error: 415 });

    request
      .post('_restart')
      .expect(415, {
        error:  'bad_content_type',
        reason: 'Content-Type must be application/json'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
