
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

  var req = this.mock.get(url);

  if (options.error === 403) {
    req.reply(403, {
      error:  'forbidden',
      reason: 'count parameter too large'
    });
  } else {
    req.reply(200, generate(options.count), {
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
