
/**
 * HEAD /:db
 * @see http://docs.couchdb.org/en/1.6.1/api/database/common.html#head--db
 *
 * Available options:
 *  - error {Number}  The status code of the error to use
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var status = this.mock.status;
  var body = '';
  var headers = { 'Content-Type': 'application/json' };

  var req = this.mock
    .head('/')
    .matchHeader('Accept', 'application/json');

  if (options.error === status.NOT_FOUND) {
    req.reply(status.NOT_FOUND, body, headers);
  } else {
    req.reply(status.OK, body, headers);
  }
};
