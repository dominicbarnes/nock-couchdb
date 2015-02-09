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

  it('should mock an existing document', function (done) {
    document.get();

    request
      .get('')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert.equal(data._id, 'test');
        assert.equal(typeof data._rev, 'string');
      })
      .end(done);
  });

  it('should include more data in the document', function (done) {
    document.get({
      rev: 'abc123',
      body: {
        'hello': 'world'
      }
    });

    request
      .get('')
      .set('Accept', 'application/json')
      .expect(status.OK, {
        _id: 'test',
        _rev: 'abc123',
        hello: 'world'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', '"abc123"')
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock an unmodified document', function (done) {
    document.get({
      status: status.NOT_MODIFIED,
      rev:   'abc123'
    });

    request
      .get('')
      .set('Accept', 'application/json')
      .set('If-None-Match', '"abc123"')
      .expect(status.NOT_MODIFIED, '')
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', 0)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', '"abc123"')
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a modified document (that was being checked)', function (done) {
    document.get({ rev: 'abc123' });

    request
      .get('')
      .set('Accept', 'application/json')
      .set('If-None-Match', '"abc123"')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', '"abc123"')
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert.equal(data._id, 'test');
        assert(data._rev);
      })
      .end(done);
  });

  it('should mock a missing document', function (done) {
    document.get({ status: status.NOT_FOUND });

    request
      .get('')
      .set('Accept', 'application/json')
      .expect(status.NOT_FOUND, {
        error:  'not_found',
        reason: 'missing'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', 40)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a failed request because of invalid credentials', function (done) {
    document.get({ status: status.UNAUTHORIZED });

    request
      .get('')
      .set('Accept', 'application/json')
      .expect(status.UNAUTHORIZED, {
        error:  'unauthorized',
        reason: 'You are not authorized to access this db.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', 77)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('ETag', /^"\d+\-\w+"$/)
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
