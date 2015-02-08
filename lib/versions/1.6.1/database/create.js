
/**
 * PUT /:db
 * @see http://docs.couchdb.org/en/1.6.1/api/database/common.html#put--db
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
    .put('/')
    .matchHeader('Accept', 'application/json');

  if (options.error === status.BAD_REQUEST) {
    req.reply(status.BAD_REQUEST, {
      error:  'illegal_database_name',
      reason: `Name: '${this.name}'. Only lowercase characters (a-z), digits (0-9), and any of the characters _, $, (, ), +, -, and / are allowed. Must begin with a letter.`
    });
  } else if (options.error === status.UNAUTHORIZED) {
    req.reply(status.UNAUTHORIZED, {
      error:  'unauthorized',
      reason: 'You are not a server admin.'
    });
  } else if (options.error === status.PRECONDITION_FAILED) {
    req.reply(status.PRECONDITION_FAILED, {
      error:  'file_exists',
      reason: 'The database could not be created, the file already exists.'
    });
  } else {
    req.reply(status.CREATED, { ok: true });
  }
};
