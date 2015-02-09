
/**
 * Module dependencies.
 */

var utils = require('../../utils');

var chance = utils.chance;

/**
 * PUT /:db/:doc
 * @see http://docs.couchdb.org/en/1.6.1/api/document/common.html#put--db-docid
 *
 * POST /:db
 * @see http://docs.couchdb.org/en/1.6.1/api/database/common.html#post--db
 *
 * Available options:
 *  - status {Number}
 *  - batch {Boolean}
 *  - rev {String}
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  var status = this.mock.status;
  var method = this.id ? 'put' : 'post';

  var id = this.id || chance.docId();
  var rev = options.rev || chance.rev();
  var headers = { 'ETag': `"${rev}"` };

  if (options.batch) {
    return this.mock[method]('/?batch=ok')
      .matchHeader('Accept', 'application/json')
      .matchHeader('Content-Type', 'application/json')
      .reply(status.ACCEPTED, {
        id: id,
        ok: true
      }, headers);
  }

  var req = this.mock[method]('/')
    .matchHeader('Accept', 'application/json')
    .matchHeader('Content-Type', 'application/json');

  if (options.status === status.BAD_REQUEST) {
    req.reply(status.BAD_REQUEST, {
      error:  'bad_request',
      reason: 'invalid_json'
    }, headers);
  } else if (options.status === status.UNAUTHORIZED) {
    req.reply(status.UNAUTHORIZED, {
      error:  'unauthorized',
      reason: 'You are not authorized to access this db.'
    }, headers);
  } else if (options.status === status.NOT_FOUND) {
    req.reply(status.NOT_FOUND, {
      error:  'not_found',
      reason: 'no_db_file'
    }, headers);
  } else if (options.status === status.CONFLICT) {
    req.reply(status.CONFLICT, {
      error:  'conflict',
      reason: 'Document update conflict.'
    }, headers);
  } else {
    req.reply(status.OK, {
      id:  id,
      rev: rev,
      ok:  true
    }, headers);
  }
};
