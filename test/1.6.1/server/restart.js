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

  it('should mock a successful request', function (done) {
    server.restart();

    request
      .post('_restart')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(status.ACCEPTED, { ok: true })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock an authentication failure', function (done) {
    server.restart({ status: status.FORBIDDEN });

    request
      .post('_restart')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(status.FORBIDDEN, {
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
    server.restart({ status: status.UNSUPPORTED_MEDIA_TYPE });

    request
      .post('_restart')
      .set('Accept', 'application/json')
      .expect(status.UNSUPPORTED_MEDIA_TYPE, JSON.stringify({
        error:  'bad_content_type',
        reason: 'Content-Type must be application/json'
      }))
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
