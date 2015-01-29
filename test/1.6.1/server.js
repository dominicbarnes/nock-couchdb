var assert = require('assert');
var supertest = require('supertest');
var mock = require('../..');

module.exports = function () {
  var server = mock.server();
  var request = supertest(server.url());
  var version = server.options.version;

  afterEach(function () {
    server.mock.done();
  });

  describe('.info()', function () {
    it('should mock the root endpoint', function (done) {
      server.info();

      request
        .get('')
        .expect(200)
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Length', /^\d+$/)
        .expect('Content-Type', 'application/json')
        .expect('Date', server.options.date.toUTCString())
        .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
        .expect(function (res) {
          assert.equal(res.body.couchdb, 'Welcome');
          assert.equal(res.body.version, version);
        })
        .end(done);
    });
  });

  describe('.activeTasks([count])', function () {
    it('should mock the active tasks endpoint', function (done) {
      server.activeTasks();

      request
        .get('_active_tasks')
        .expect(200)
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Length', /^\d+$/)
        .expect('Content-Type', 'application/json')
        .expect('Date', server.options.date.toUTCString())
        .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
        .expect(function (res) {
          var data = res.body;
          assert(Array.isArray(data));
          assert(data.length >= 1 && data.length <= 10);
          assert(data[0].type);
        })
        .end(done);
    });

    it('should allow setting a custom number of tasks', function (done) {
      server.activeTasks(15);

      request
        .get('_active_tasks')
        .expect(200)
        .expect(function (res) {
          assert.equal(res.body.length, 15);
        })
        .end(done);
    });
  });

  describe('.allDbs([count])', function () {
    it('should mock the all dbs endpoint', function (done) {
      server.allDbs();

      request
        .get('_all_dbs')
        .expect(200)
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Length', /^\d+$/)
        .expect('Content-Type', 'application/json')
        .expect('Date', server.options.date.toUTCString())
        .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
        .expect(function (res) {
          var data = res.body;
          assert(Array.isArray(data));
          assert(data.length >= 1 && data.length <= 10);
          assert.equal(data[0], '_users');
          assert.equal(data[1], '_replicator');
        })
        .end(done);
    });

    it('should allow setting a custom number of non-system dbs', function (done) {
      server.allDbs(13);

      request
        .get('_all_dbs')
        .expect(200)
        .expect(function (res) {
          assert.equal(res.body.length, 15);
        })
        .end(done);
    });

    it('should always include the system dbs', function (done) {
      server.allDbs(0);

      request
        .get('_all_dbs')
        .expect(200)
        .expect(function (res) {
          assert.deepEqual(res.body, [ '_users', '_replicator' ]);
        })
        .end(done);
    });
  });

  describe('.log([query])', function () {
    it('should mock the log endpoint', function (done) {
      server.log();

      request
        .get('_log')
        .expect(200)
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Type', 'text/plain')
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
  });

  describe('.restart([options])', function () {
    it('should mock a successful request', function (done) {
      server.restart();

      request
        .post('_restart')
        .expect(202, { ok: true })
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Type', 'application/json')
        .expect('Date', server.options.date.toUTCString())
        .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
        .end(done);
    });

    it('should mock an authentication failure', function (done) {
      server.restart({ error: 403 });

      request
        .post('_restart')
        .expect(403, {
          error:  'unauthorized',
          reason: 'You are not a server admin.'
        })
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Type', 'application/json')
        .expect('Date', server.options.date.toUTCString())
        .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
        .end(done);
    });

    it('should mock a content-type failure', function (done) {
      server.restart({ error: 415 });

      request
        .post('_restart')
        .expect(415, {
          error:  'bad_content_type',
          reason: 'Content-Type must be application/json'
        })
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Type', 'application/json')
        .expect('Date', server.options.date.toUTCString())
        .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
        .end(done);
    });
  });

  describe('.stats([options])', function () {
    it('should mock a successful request', function (done) {
      server.stats();

      request
        .get('_stats')
        .expect(200)
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

    it('should mock a successful request for only a subset', function (done) {
      server.stats({
        group: 'httpd_request_methods',
        key:   'GET'
      });

      request
        .get('_stats/httpd_request_methods/GET')
        .expect(200)
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

    it('should mock a successful request for a non-existant group/key', function (done) {
      server.stats({
        group: 'test',
        key:   'test',
        empty: true
      });

      request
        .get('_stats/test/test')
        .expect(200)
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
        error: 400
      });

      request
        .get('_stats/test')
        .expect(400, {
          error:  'bad_request',
          reason: 'Stat names must have exactly two parts.'
        })
        .expect('Cache-Control', 'must-revalidate')
        .expect('Content-Type', 'application/json')
        .expect('Date', server.options.date.toUTCString())
        .expect('Server', `CouchDB/${version} (Erlang/OTP)`)
        .end(done);
    });
  });
};
