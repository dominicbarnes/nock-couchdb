
/**
 * Module dependencies.
 */

var len = require('../../../utils').len;

/**
 * GET /
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--
 */

module.exports = function () {
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
