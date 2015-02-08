
/**
 * POST /_restart
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#post--_restart
 *
 * Available options:
 *  - error {Number}  Use HTTP status code from docs
 */

module.exports = function (options) {
  if (!options) options = {};

  var status = this.mock.status;
  var req = this.mock
    .post('/_restart')
    .matchHeader('Accept', 'application/json');

  if (options.error === status.UNSUPPORTED_MEDIA_TYPE) {
    return req.reply(status.UNSUPPORTED_MEDIA_TYPE, {
      error:  'bad_content_type',
      reason: 'Content-Type must be application/json'
    }, { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  req.matchHeader('Content-Type', 'application/json');

  if (options.error === status.FORBIDDEN) {
    req.reply(status.FORBIDDEN, {
      error:  'unauthorized',
      reason: 'You are not a server admin.'
    });
  } else {
    req.reply(status.ACCEPTED, { ok: true });
  }
};
