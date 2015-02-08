
/**
 * POST /:db/_compact
 * @see http://docs.couchdb.org/en/1.6.1/api/database/compact.html#post--db-_compact
 *
 * POST /:db/_compact/:ddoc
 * @see http://docs.couchdb.org/en/1.6.1/api/database/compact.html#post--db-_compact-ddoc
 *
 * Available options:
 * - ddoc {String}  Uses ddoc URL
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var url = '/_compact';
  if (options.ddoc) url += `/${options.ddoc}`;

  var status = this.mock.status;
  var req = this.mock
    .post(url)
    .matchHeader('Accept', 'application/json');

  if (options.error === status.UNSUPPORTED_MEDIA_TYPE) {
    return req.reply(status.UNSUPPORTED_MEDIA_TYPE, {
      error:  'bad_content_type',
      reason: 'Content-Type must be application/json'
    }, { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  req.matchHeader('Content-Type', 'application/json');

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
  } else {
    req.reply(status.ACCEPTED, { ok: true });
  }
};
