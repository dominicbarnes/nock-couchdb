
/**
 * Module dependencies.
 */

var utils = require('../../utils');

var chance = utils.chance;
var clone = utils.clone;

/**
 * GET /:db/:doc
 * @see http://docs.couchdb.org/en/1.6.1/api/document/common.html#get--db-docid
 *
 * Available options:
 *  - status {Number}
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var status = this.mock.status;

  var body = clone(options.body);
  var rev = options.rev || chance.rev();

  body._id = this.id;
  body._rev = rev;

  var headers = {
    'Content-Type': 'application/json',
    'ETag': `"${rev}"`
  };

  var req = this.mock
    .get('/')
    .matchHeader('Accept', 'application/json');

  if (options.status === status.NOT_MODIFIED) {
    headers['Content-Length'] = 0;
    req.matchHeader('If-None-Match', `"${rev}"`)
    req.reply(status.NOT_MODIFIED, '', headers)
  } else if (options.status === status.NOT_FOUND) {
    req.reply(status.NOT_FOUND, {
      error:  'not_found',
      reason: 'missing'
    }, headers);
  } else if (options.status === status.UNAUTHORIZED) {
    req.reply(status.UNAUTHORIZED, {
      error:  'unauthorized',
      reason: 'You are not authorized to access this db.'
    }, headers);
  } else {
    req.reply(status.OK, body, headers);
  }
};

function len(body) {
  return JSON.stringify(body).length;
}
