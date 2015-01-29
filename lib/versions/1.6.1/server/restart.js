
/**
 * POST /_restart
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#post--_restart
 *
 * Available options:
 *  - error {Number}  Use HTTP status code from docs
 */

module.exports = function (options) {
  if (!options) options = {};

  var req = this.mock.post('/_restart');

  if (options.error === 415) {
    req.reply(415, {
      error:  'bad_content_type',
      reason: 'Content-Type must be application/json'
    });
  } else if (options.error === 403) {
    req.reply(403, {
      error:  'unauthorized',
      reason: 'You are not a server admin.'
    });
  } else {
    req.reply(202, { ok: true });
  }

  return req;
};
