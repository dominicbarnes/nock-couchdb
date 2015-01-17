var assert = require('assert');
var supertest = require('supertest');
var mock = require('..');

describe('document(id)', function () {
  var server = mock.server();
  var database = server.database('db');
  var document = database.document('doc');
  var request = supertest(server.base);

  afterEach(function () {
    assert(server.done());
    server.clean();
  });

  it('should store a reference to the server', function () {
    assert.strictEqual(document.server, server);
  });

  it('should store a reference to the database', function () {
    assert.strictEqual(document.database, database);
  });

  it('should store the name as a property', function () {
    assert.equal(document.id, 'doc');
  });

  describe('document.get([data])', function () {
    it('should mock the document retrieval', function (done) {
      document.get();

      request
        .get('db/doc')
        .expect(200)
        .expect(function (res) {
          var data = res.body;
          assert.equal(data._id, 'doc');
          assert.equal(typeof data._rev, 'string');
        })
        .end(done);
    });

    it('should allow setting custom document data', function (done) {
      document.get({ hello: 'world' });

      request
        .get('db/doc')
        .expect(200)
        .expect(function (res) {
          var data = res.body;
          assert.equal(data._id, 'doc');
          assert.equal(typeof data._rev, 'string');
          assert.equal(data.hello, 'world');
        })
        .end(done);
    });
  });
});
