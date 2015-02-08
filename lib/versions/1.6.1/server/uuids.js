
/**
 * Module dependencies.
 */

var chance = require('../../../utils').chance;

/**
 * GET /_uuids
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--_uuids
 *
 * Available `options`:
 *  - count {Number}
 *  - error {Number}
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var url = '/_uuids';
  if (options.count) url += `?count=${options.count}`;

  var status = this.mock.status;
  var req = this.mock
    .get(url)
    .matchHeader('Accept', 'application/json');

  if (options.error === status.FORBIDDEN) {
    req.reply(status.FORBIDDEN, {
      error:  'forbidden',
      reason: 'count parameter too large'
    });
  } else {
    req.reply(status.OK, generate(options.count), {
      'ETag': `"${chance.etag()}"`
    });
  }
};

/**
 * Generates the JSON output.
 *
 * @param {Number} count
 * @returns {Object}
 */

function generate(count) {
  return {
    uuids: chance.n(chance.uuid, count || 1)
  };
}
