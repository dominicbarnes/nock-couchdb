
/**
 * Module dependencies.
 */

var utils = require('../../utils');

var chance = utils.chance;

/**
 * DELETE /:db/:doc
 * @see http://docs.couchdb.org/en/1.6.1/api/document/common.html#delete--db-docid
 *
 * Available options:
 *  - status {Number}  The HTTP status code to use
 *  - batch {Boolean}
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var status = this.mock.status;

  var url = '/';
  if (options.batch) url += '?batch=ok';
  var req = this.mock
    .delete(url)
    .matchHeader('Accept', 'application/json');

  if (options.status === status.ACCEPTED) {
    req.reply(status.ACCEPTED, {
      ok: true,
      id: this.id
    });
  } else if (options.status === status.BAD_REQUEST) {
    req.reply(status.BAD_REQUEST, {
      error:  'bad_request',
      reason: 'Invalid rev format.'
    });
  } else if (options.status === status.UNAUTHORIZED) {
    req.reply(status.UNAUTHORIZED, {
      error:  'unauthorized',
      reason: 'You are not authorized to access this db.'
    });
  } else if (options.status === status.NOT_FOUND) {
    req.reply(status.NOT_FOUND, {
      error:  'not_found',
      reason: 'missing'
    });
  } else {
    req.reply(status.OK, {
      ok: true,
      id: this.id,
      rev: chance.rev()
    });
  }
};
