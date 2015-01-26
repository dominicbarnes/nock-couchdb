
/**
 * Module dependencies.
 */

var utils = require('../../../utils');

var chance = utils.chance;

/**
 * GET /_all_dbs
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--_all_dbs
 */

module.exports = function (count) {
  var body = [ '_users', '_replicator' ].concat(dbs(count));

  return this.mock
    .get('/_all_dbs')
    .reply(200, body);
};

function dbs(count) {
  if (count === 0) return [];
  if (typeof count === 'undefined') count = chance.natural({ min: 1, max: 8 });
  return chance.n(chance.word, count);
}
