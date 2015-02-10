var assert = require('assert');
var supertest = require('supertest');
var mock = require('../../..');
var status = mock.status;

module.exports = function () {
  var server = mock.server();
  var database = server.database('test');
  var document = database.designDocument('test');
  var request = supertest(document.url());
  var version = server.options.version;

  afterEach(function () {
    document.done();
  });

  it('should mock a successful request for design document info', function (done) {
    document.info();

    request
      .get('_info')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', /^\d+$/)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert.equal(data.name, 'test');
        var view = data.view_index;
        assert.equal(typeof view.compact_running, 'boolean');
        assert.equal(typeof view.data_size, 'number');
        assert.equal(typeof view.disk_size, 'number');
        assert.equal(typeof view.language, 'string');
        assert.equal(typeof view.purge_seq, 'number');
        assert.equal(typeof view.signature, 'string');
        assert.equal(typeof view.update_seq, 'number');
        assert.equal(typeof view.updater_running, 'boolean');
        assert.equal(typeof view.waiting_clients, 'number');
        assert.equal(typeof view.waiting_commit, 'boolean');
      })
      .end(done);
  });

  it('should mock a missing design document', function (done) {
    document.info({ status: status.NOT_FOUND });

    request
      .get('_info')
      .set('Accept', 'application/json')
      .expect(status.NOT_FOUND, {
        error:  'not_found',
        reason: 'missing'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Length', 40)
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
