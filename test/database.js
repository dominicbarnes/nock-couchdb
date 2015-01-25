var assert = require('assert');
var supertest = require('supertest');
var mock = require('..');

describe('database', function () {
  var server = mock.server();
  var database = server.database('test');
  var request = supertest(database.url());

  afterEach(function () {
    server.done();
  });

  it('should store some references', function () {
    assert.strictEqual(database.server, server);
  });

  it('should store the name as a property', function () {
    assert.equal(database.name, 'test');
  });

  describe('database.info([data])', function () {
    it('should mock the root endpoint', function (done) {
      database.info();

      request
        .get('')
        .expect(200)
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
        data_size: 123456,
        doc_count: 10
      });

      request
        .get('')
        .expect(200)
        .expect(function (res) {
          var data = res.body;
          assert.equal(data.data_size, 123456);
          assert.equal(data.doc_count, 10);
        })
        .end(done);
    });
  });
});
