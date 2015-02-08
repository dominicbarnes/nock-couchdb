
/**
 * Module dependencies.
 */

var chance = require('../../utils').chance;

/**
 * GET /_stats
 * GET /_stats/:group/:key
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--_stats
 *
 * Available options:
 *  - group {String}   The 1st part of the URL (optional)
 *  - key {String}     The 2nd part of the URL (optional)
 *  - empty {Boolean}  Forces all the stats objects to report no data
 *  - error {Number}   Use HTTP status code from docs
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var url = '/_stats';
  if (options.group) url += `/${options.group}`;
  if (options.key) url += `/${options.key}`;

  var status = this.mock.status;
  var req = this.mock
    .get(url)
    .matchHeader('Accept', 'application/json');

  if (options.error === status.BAD_REQUEST) {
    req.reply(status.BAD_REQUEST, {
      error:  'bad_request',
      reason: 'Stat names must have exactly two parts.'
    });
  } else {
    req.reply(status.OK, generate(options.group, options.key, options.empty));
  }
};

/**
 * Stats object descriptions.
 */

var descriptions = {
  couchdb: {
    auth_cache_hits:   'number of authentication cache hits',
    auth_cache_misses: 'number of authentication cache misses',
    database_reads:    'number of times a document was read from a database',
    database_writes:   'number of times a database was changed',
    open_databases:    'number of open databases',
    open_os_files:     'number of file descriptors CouchDB has open',
    request_time:      'length of a request inside CouchDB without MochiWeb'
  },

  httpd_request_methods: {
    COPY:   'number of HTTP COPY requests',
    DELETE: 'number of HTTP DELETE requests',
    GET:    'number of HTTP GET requests',
    HEAD:   'number of HTTP HEAD requests',
    POST:   'number of HTTP POST requests',
    PUT:    'number of HTTP PUT requests'
  },

  httpd_status_codes: {
    200: 'number of HTTP 200 OK responses',
    201: 'number of HTTP 201 Created responses',
    202: 'number of HTTP 202 Accepted responses',
    301: 'number of HTTP 301 Moved Permanently responses',
    304: 'number of HTTP 304 Not Modified responses',
    400: 'number of HTTP 400 Bad Request responses',
    401: 'number of HTTP 401 Unauthorized responses',
    403: 'number of HTTP 403 Forbidden responses',
    404: 'number of HTTP 404 Not Found responses',
    405: 'number of HTTP 405 Method Not Allowed responses',
    409: 'number of HTTP 409 Conflict responses',
    412: 'number of HTTP 412 Precondition Failed responses',
    500: 'number of HTTP 500 Internal Server Error responses'
  },

  httpd: {
    bulk_requests:              'number of bulk requests',
    clients_requesting_changes: 'number of clients for continuous _changes',
    requests:                   'number of HTTP requests',
    temporary_view_reads:       'number of temporary view reads',
    view_reads:                 'number of view reads'
  }
};

/**
 * Retrieve a description from the above hash.
 *
 * @param {String} group
 * @param {String} key
 * @returns {String}
 */

function description(group, key) {
  if (group in descriptions) {
    if (key in descriptions[group]) {
      return descriptions[group][key];
    }
  }

  return '';
}

/**
 * Generates the stats object. If _both_ `group` and `key` are provided, it
 * will only include a subset of the object.
 *
 * @param {String} [group]
 * @param {String} [key]
 * @returns {Object}
 */

function generate(group, key, empty) {
  var stats = {};

  if (group && key) {
    stats[group] = {};
    stats[group][key] = fields(description(group, key), empty);
  } else {
    Object.keys(descriptions).forEach(function (group) {
      stats[group] = {};
      Object.keys(descriptions[group]).forEach(function (key) {
        stats[group][key] = fields(description(group, key), empty);
      });
    });
  }

  return stats;
}

/**
 * Generate a single stats object.
 *
 * TODO: make these numbers more realistic
 *
 * @param {String} description
 * @param {Boolean} [empty]
 * @returns {Object}
 */

function fields(description, empty) {
  if (typeof empty === 'undefined') empty = chance.bool({ likelihood: 10 });

  if (empty) {
    return {
      current:     null,
      description: description,
      max:         null,
      mean:        null,
      min:         null,
      stddev:      null,
      sum:         null
    };
  } else {
    return {
      current:     chance.natural({ max: 9999 }),
      description: description,
      max:         chance.natural({ max: 99999 }),
      mean:        chance.natural({ min: 999, max: 9999 }),
      min:         chance.natural({ max: 100 }),
      stddev:      chance.floating({ min: 0, max: 1 }),
      sum:         chance.natural({ max: 99999 })
    };
  }
}
