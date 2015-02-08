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

  it('should mock a successful longpoll request', function (done) {
    server.dbUpdates();
    var start = new Date();

    this.slow(1000);

    request
      .get('_db_updates')
      .expect(200)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Transfer-Encoding', 'chunked')
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        var end = new Date();
        assert.equal(typeof data.db_name, 'string');
        assert.strictEqual(data.ok, true);
        assert.equal(typeof data.type, 'string');
        assert((end - start) >= 250);
      })
      .end(done);
  });
};
