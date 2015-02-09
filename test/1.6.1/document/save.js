var assert = require('assert');
var supertest = require('supertest');
var mock = require('../../..');
var status = mock.status;

module.exports = function () {
  var server = mock.server();
  var database = server.database('test');
  var document = database.document('test');
  var request = supertest(document.url());
  var version = server.options.version;

  afterEach(function () {
    document.done();
  });

  it('should mock a successful request', function (done) {
    document.save();

    request
      .put('')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert.equal(data.id, 'test');
        assert.equal(typeof data.rev, 'string');
        assert.strictEqual(data.ok, true);
      })
      .end(done);
  });

  it('should mock a successful batch request', function (done) {
    document.save({ batch: true });

    request
      .put('')
      .query({ batch: 'ok' })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(status.ACCEPTED, {
        id: 'test',
        ok: true
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should allow you to set a custom rev/etag', function (done) {
    document.save({ rev: 'abc123' });

    request
      .put('')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(status.OK, {
        id:  'test',
        rev: 'abc123',
        ok:  true
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', '"abc123"')
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failed request due to malformed data', function (done) {
    document.save({ status: status.BAD_REQUEST });

    request
      .put('')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send('{') // invalid json
      .expect(status.BAD_REQUEST, {
        error:  'bad_request',
        reason: 'invalid_json'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failed request due to malformed data', function (done) {
    document.save({ status: status.UNAUTHORIZED });

    request
      .put('')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ hello: 'world' })
      .expect(status.UNAUTHORIZED, {
        error:  'unauthorized',
        reason: 'You are not authorized to access this db.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failed request due to missing db', function (done) {
    document.save({ status: status.NOT_FOUND });

    request
      .put('')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ hello: 'world' })
      .expect(status.NOT_FOUND, {
        error:  'not_found',
        reason: 'no_db_file'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failed request due to missing db', function (done) {
    document.save({ status: status.CONFLICT });

    request
      .put('')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ hello: 'world' })
      .expect(status.CONFLICT, {
        error:  'conflict',
        reason: 'Document update conflict.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should use post without an id', function (done) {
    var document = database.document();
    var request = supertest(document.url());

    document.save();

    request
      .post('')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ hello: 'world' })
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert.strictEqual(data.ok, true);
        assert(data.id);
        assert(data.rev);
      })
      .end(done);
  });
};
