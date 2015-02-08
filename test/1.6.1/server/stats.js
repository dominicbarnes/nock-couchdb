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
    server.stats();

    request
      .get('_stats')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        Object.keys(data).forEach(function (group) {
          data[group] = Object.keys(data[group]);
        });
        assert.deepEqual(data, {
          couchdb: [
            'auth_cache_hits',
            'auth_cache_misses',
            'database_reads',
            'database_writes',
            'open_databases',
            'open_os_files',
            'request_time'
          ],
          httpd_request_methods: [
            'COPY', 'DELETE', 'GET',
            'HEAD', 'POST', 'PUT'
          ],
          httpd_status_codes: [
            200, 201, 202,
            301, 304,
            400, 401, 403, 404, 405, 409, 412,
            500
          ],
          httpd: [
            'bulk_requests',
            'clients_requesting_changes',
            'requests',
            'temporary_view_reads',
            'view_reads'
          ]
        });
      })
      .end(done);
  });

  it('should mock a request for only a subset', function (done) {
    server.stats({
      group: 'httpd_request_methods',
      key:   'GET'
    });

    request
      .get('_stats/httpd_request_methods/GET')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        var data = res.body;
        assert.deepEqual(Object.keys(data), [ 'httpd_request_methods' ]);
        assert.deepEqual(Object.keys(data.httpd_request_methods), [ 'GET' ]);
      })
      .end(done);
  });

  it('should mock a request for a non-existant group/key', function (done) {
    server.stats({
      group: 'test',
      key:   'test',
      empty: true
    });

    request
      .get('_stats/test/test')
      .set('Accept', 'application/json')
      .expect(status.OK)
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .expect(function (res) {
        assert.deepEqual(res.body, {
          test: {
            test: {
              current:     null,
              description: '',
              max:         null,
              mean:        null,
              min:         null,
              stddev:      null,
              sum:         null
            }
          }
        });
      })
      .end(done);
  });

  it('should mock a failed request for a group only (missing key)', function (done) {
    server.stats({
      group: 'test',
      error: status.BAD_REQUEST
    });

    request
      .get('_stats/test')
      .set('Accept', 'application/json')
      .expect(status.BAD_REQUEST, {
        error:  'bad_request',
        reason: 'Stat names must have exactly two parts.'
      })
      .expect('Cache-Control', 'must-revalidate')
      .expect('Content-Type', 'application/json')
      .expect('Date', server.options.date.toUTCString())
      .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
      .end(done);
  });
};
