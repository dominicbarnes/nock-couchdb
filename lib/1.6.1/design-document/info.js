
/**
 * Module dependencies.
 */

var utils = require('../../utils');

var chance = utils.chance;

/**
 * GET /:db/_design/:ddoc/_info
 * @see http://docs.couchdb.org/en/1.6.1/api/ddoc/common.html#get--db-_design-ddoc-_info
 *
 * Mocks the design document information endpoint.
 *
 * Available options:
 *  - status {Number}  The HTTP status code to use
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var status = this.mock.status;
  var req = this.mock.get('/_info')
    .matchHeader('Accept', 'application/json');

  if (options.status === status.NOT_FOUND) {
    req.reply(status.NOT_FOUND, {
      error:  'not_found',
      reason: 'missing'
    });
  } else {
    req.reply(status.OK, generate(this, options));
  }
};

/**
 * Generate the response body.
 *
 * @param {Object} options
 * @returns {Object}
 */

function generate(ddoc, options) {
  return {
    name: ddoc.name,

    view_index: {
      compact_running: chance.bool({ likelihood: 1 }),
      data_size:       chance.natural({ max: 999999 }),
      disk_size:       chance.natural({ max: 999999 }),
      disk_size:       chance.natural({ max: 999999 }),
      language:        chance.pick([ "erlang", "javascript", "python" ]),
      purge_seq:       chance.natural({ max: 10 }),
      signature:       chance.hash(),
      update_seq:      chance.natural({ max: 100 }),
      updater_running: chance.bool({ likelihood: 1 }),
      waiting_clients: chance.natural({ max: 50 }),
      waiting_commit:  chance.bool({ likelihood: 1 }),
    }
  }
}
