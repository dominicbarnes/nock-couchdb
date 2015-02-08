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

  it('should mock an existing database', function (done) {
    database.exists();

    request
      .head('')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });

  it('should mock a missing database', function (done) {
    database.exists({ error: status.NOT_FOUND });

    request
      .head('')
      .expect(status.NOT_FOUND)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
