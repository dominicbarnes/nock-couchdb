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
    database.allDocs();

    request
      .get('_all_docs')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'text/plain')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = JSON.parse(res.text);
        assert.equal(typeof data.offset, 'number');
        assert.equal(typeof data.total_rows, 'number');
        assert(Array.isArray(data.rows));
        data.rows.forEach(function (row) {
          assert.equal(typeof row.id, 'string');
          assert.equal(row.id, row.key);
          assert.equal(typeof row.value.rev, 'string');
        });
      })
      .end(done);
  });

  it('should allow us to set a specific offset', function (done) {
    database.allDocs({ offset: 15 });

    request
      .get('_all_docs')
      .expect(status.OK)
      .expect(function (res) {
        var data = JSON.parse(res.text);
        assert.equal(data.offset, 15);
      })
      .end(done);
  });

  it('should allow us to set a specific total (and the counts should be realistic)', function (done) {
    database.allDocs({ total: 25 });

    request
      .get('_all_docs')
      .expect(status.OK)
      .expect(function (res) {
        var data = JSON.parse(res.text);
        var total = data.total_rows;
        var count = data.rows.length;
        var offset = data.offset;

        assert.equal(total, 25);
        assert(offset + count <= total);
      })
      .end(done);
  });

  it('should allow us to set a custom number of rows', function (done) {
    database.allDocs({ count: 12 });

    request
      .get('_all_docs')
      .expect(status.OK)
      .expect(function (res) {
        var data = JSON.parse(res.text);
        var total = data.total_rows;
        var count = data.rows.length;
        var offset = data.offset;

        assert.equal(count, 12);
        assert(offset + count <= total);
      })
      .end(done);
  });
};
