
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
 *  - error {Number}
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
    'ETag': etag
  };

  var req = this.mock
    .head('/')
    .matchHeader('Accept', 'application/json');

  // TODO: mock If-None-Match using outdated/incorrect ETag

  if (options.error === status.NOT_MODIFIED) {
    req.matchHeader('If-None-Match', etag);
    code = status.NOT_MODIFIED;
    headers['Content-Length'] = 0;
  } else if (options.error === status.NOT_FOUND) {
    code = status.NOT_FOUND;
    headers['Content-Length'] = len({
      error:  'not_found',
      reason: 'missing'
    });
  } else if (options.error === status.UNAUTHORIZED) {
    code = status.UNAUTHORIZED;
    headers['Content-Length'] = len({
      error:  'unauthorized',
      reason: 'You are not authorized to access this db.'
    });
  }

  req.reply(code, body, headers);
};

function len(body) {
  return JSON.stringify(body).length;
}
