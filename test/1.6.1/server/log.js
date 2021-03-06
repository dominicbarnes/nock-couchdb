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
    server.log();

    request
      .get('_log')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect('Date', server.options.date.toUTCString())
      .expect('Transfer-Encoding', 'chunked')
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.text;
        assert(data);
        assert.equal(data.length, 1000);
      })
      .end(done);
  });
};
