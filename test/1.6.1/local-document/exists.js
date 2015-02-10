var assert = require('assert');
var supertest = require('supertest');
var mock = require('../../..');
var status = mock.status;

module.exports = function () {
  var server = mock.server();
  var database = server.database('test');
  var document = database.localDocument('test');
  var request = supertest(document.url());
  var version = server.options.version;

  afterEach(function () {
    document.done();
  });

  it('should mock an existing document', function (done) {
    document.exists();

    request
      .head('')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Etag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock an unmodified document', function (done) {
    document.exists({
      status: status.NOT_MODIFIED,
      etag:  'abc123'
    });

    request
      .head('')
      .set('Accept', 'application/json')
      .set('If-None-Match', '"abc123"')
      .expect(status.NOT_MODIFIED, '')
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', 0)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Etag', '"abc123"')
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a modified document (that was being checked)', function (done) {
    document.exists({ etag: 'abc123' });

    request
      .head('')
      .set('Accept', 'application/json')
      .set('If-None-Match', '"abc123"')
      .expect(status.OK, '')
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Etag', '"abc123"')
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a missing document', function (done) {
    document.exists({ status: status.NOT_FOUND });

    request
      .head('')
      .set('Accept', 'application/json')
      .expect(status.NOT_FOUND)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', 40)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Etag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failed request because of invalid credentials', function (done) {
    document.exists({ status: status.UNAUTHORIZED });

    request
      .head('')
      .set('Accept', 'application/json')
      .expect(status.UNAUTHORIZED, '')
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', 77)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Etag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
