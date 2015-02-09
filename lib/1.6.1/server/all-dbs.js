
/**
 * Module dependencies.
 */

var utils = require('../../utils');

var chance = utils.chance;
var defaults = utils.defaults;

var system = [ '_users', '_replicator' ];

/**
 * GET /_all_dbs
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--_all_dbs
 *
 * Available `options`:
 *  - count {Number}  How many user databases to include
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var count = typeof options.count !== 'undefined'
    ? chance.natural({ min: 1, max: 8 })
    : options.count;

  var user = chance.n(chance.word, options.count);

  this.mock
    .get('/_all_dbs')
    .matchHeader('Accept', 'application/json')
    .reply(this.mock.status.OK, system.concat(user));
};
