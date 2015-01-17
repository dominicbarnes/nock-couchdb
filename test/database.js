var assert = require('assert');
var supertest = require('supertest');
var mock = require('..');

describe('database(name)', function () {
  var server = mock.server();
  var db = server.database('test');
  var request = supertest(server.base);

  afterEach(function () {
    assert(server.done());
    server.clean();
  });

  it('should store a reference to the server', function () {
    assert.strictEqual(db.server, server);
  });

  it('should store the name as a property', function () {
    assert.equal(db.name, 'test');
  });

  describe('database.info([data])', function () {
    it('should mock the root endpoint', function (done) {
      db.info();

      request
        .get('test')
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
      db.info({
        data_size: 123456,
        doc_count: 10
      });

      request
        .get('test')
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
