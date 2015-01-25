
/**
 * Module dependencies.
 */

var utils = require('../../utils');

var len = utils.len;

/**
 * GET /
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--
 */

exports.info = function () {
  var body = {
    couchdb: 'Welcome',
    version: this.options.version
  };

  return this.mock
    .get('/')
    .reply(200, body, {
      'Content-Length': len(body)
    });
};
