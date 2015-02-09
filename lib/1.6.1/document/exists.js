
/**
 * Module dependencies.
 */

var utils = require('../../utils');

var chance = utils.chance;

/**
 * HEAD /:db/:doc
 * @see http://docs.couchdb.org/en/1.6.1/api/document/common.html#head--db-docid
 *
 * Available options:
 *  - status {Number}  The HTTP status code to use
 *  - size {Number}   Content-Length for underlying document
 *  - etag {String}   Specified ETag (otherwise it will be random and impossible to mock externally)
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var status = this.mock.status;

  var size = options.size || chance.natural({ max: 10000 });
  var etag = options.etag || chance.rev();
  var code = status.OK;
  var body = '';
  var headers = {
    'Content-Length': size,
    'Content-Type': 'application/json',
    'ETag': `"${etag}"`
  };

  var req = this.mock
    .head('/')
    .matchHeader('Accept', 'application/json');

  if (options.status === status.NOT_MODIFIED) {
    req.matchHeader('If-None-Match', `"${etag}"`);
    code = status.NOT_MODIFIED;
    headers['Content-Length'] = 0;
  } else if (options.status === status.NOT_FOUND) {
    code = status.NOT_FOUND;
    headers['Content-Length'] = len({
      error:  'not_found',
      reason: 'missing'
    });
  } else if (options.status === status.UNAUTHORIZED) {
    code = status.UNAUTHORIZED;
    headers['Content-Length'] = len({
      error:  'unauthorized',
      reason: 'You are not authorized to access this db.'
    });
  } else if (options.etag) {
    req.matchHeader('If-None-Match', `"${etag}"`);
  }

  req.reply(code, body, headers);
};

function len(body) {
  return JSON.stringify(body).length;
}
