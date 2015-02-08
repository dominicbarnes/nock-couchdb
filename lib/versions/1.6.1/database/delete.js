
/**
 * DELETE /:db
 * @see http://docs.couchdb.org/en/1.6.1/api/database/common.html#delete--db
 *
 * Available options:
 *  - error {Number}  The status code of the error to use
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var status = this.mock.status;
  var req = this.mock
    .delete('/')
    .matchHeader('Accept', 'application/json');

  if (options.error === status.BAD_REQUEST) {
    req.reply(status.BAD_REQUEST, {
      error:  'bad_request',
      reason: 'You tried to DELETE a database with a ?rev= parameter. Did you mean to DELETE a document instead?'
    });
  } else if (options.error === status.UNAUTHORIZED) {
    req.reply(status.UNAUTHORIZED, {
      error:  'unauthorized',
      reason: 'You are not a server admin.'
    });
  } else if (options.error === status.NOT_FOUND) {
    req.reply(status.NOT_FOUND, {
      error:  'not_found',
      reason: 'missing'
    });
  } else {
    req.reply(status.OK, { ok: true });
  }
};
