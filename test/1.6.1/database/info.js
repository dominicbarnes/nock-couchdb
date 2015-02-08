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

  it('should mock a successful request', function (done) {
    database.info();

    request
      .get('')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert.equal(data.db_name, 'test');
        assert.equal(typeof data.committed_update_seq, 'number');
        assert.equal(typeof data.compact_running, 'boolean');
        assert.equal(typeof data.data_size, 'number');
        assert.equal(typeof data.disk_format_version, 'number');
        assert.equal(typeof data.disk_size, 'number');
        assert.equal(typeof data.doc_count, 'number');
        assert.equal(typeof data.doc_del_count, 'number');
        assert.equal(typeof data.instance_start_time, 'string');
        assert.equal(typeof data.purge_seq, 'number');
        assert.equal(typeof data.update_seq, 'number');
      })
      .end(done);
  });

  it('should allow overriding some of the response', function (done) {
    database.info({
      data: {
        data_size: 123456,
        doc_count: 10
      }
    });

    request
      .get('')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect(function (res) {
        var data = res.body;
        assert.equal(data.data_size, 123456);
        assert.equal(data.doc_count, 10);
      })
      .end(done);
  });
};
