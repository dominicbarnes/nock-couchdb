
/**
 * Module dependencies.
 */

var utils = require('../../../utils');

var chance = utils.chance;
var defaults = utils.defaults;

/**
 * GET /:db
 * @see http://docs.couchdb.org/en/1.6.1/api/database/common.html#get--db
 *
 * Available options:
 *  - error {Number}  The status code of the error to use
 *  - data {Object}   Overrides for the returned data
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var req = this.mock.get('/');
  var status = this.mock.status;

  if (options.error === status.NOT_FOUND) {
    req.reply(status.NOT_FOUND, {
      error:  'not_found',
      reason: 'no_db_file'
    });
  } else {
    req.reply(status.OK, generate(this.name, options.data));
  }
};

/**
 * Generate a random db info hash.
 *
 * @param {String} name
 * @param {Object} data
 * @returns {Object}
 */

function generate(name, data) {
  return defaults(data, {
    committed_update_seq: chance.natural(),
    compact_running:      chance.bool(),
    data_size:            chance.natural(),
    db_name:              name,
    disk_format_version:  chance.natural({ max: 10 }),
    disk_size:            chance.natural(),
    doc_count:            chance.natural({ max: 1000 }),
    doc_del_count:        chance.natural({ max: 100 }),
    instance_start_time:  chance.hammertime().toString(),
    purge_seq:            chance.natural({ max: 100 }),
    update_seq:           chance.natural({ max: 10000 })
  });
}
