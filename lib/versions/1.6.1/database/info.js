
/**
 * Module dependencies.
 */

var utils = require('../../../utils');

var chance = utils.chance;
var defaults = utils.defaults;

/**
 * GET /
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--
 */

module.exports = function (data) {
  var body = defaults(data, {
    committed_update_seq: chance.natural(),
    compact_running:      chance.bool(),
    data_size:            chance.natural(),
    db_name:              this.name,
    disk_format_version:  chance.natural({ max: 10 }),
    disk_size:            chance.natural(),
    doc_count:            chance.natural({ max: 1000 }),
    doc_del_count:        chance.natural({ max: 100 }),
    instance_start_time:  chance.hammertime().toString(),
    purge_seq:            chance.natural({ max: 100 }),
    update_seq:           chance.natural({ max: 10000 })
  });

  return this.mock
  .get('/')
  .reply(200, body);
};
