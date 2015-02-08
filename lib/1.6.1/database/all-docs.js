
/**
 * Module dependencies.
 */

var utils = require('../../utils');

var chance = utils.chance;

/**
 * GET /:db/_all_docs
 * @see http://docs.couchdb.org/en/1.6.1/api/database/bulk-api.html#get--db-_all_docs
 *
 * Available options:
 *  - count {Number}   View results `rows.length` (default: 0 <= ? <= 100)
 *  - offset {Number}  View results `offset` (default: 0 <= ? <= 100)
 *  - total {Number}   View results `total_rows` (default: count + offset <= ? <= +1000)
 *
 * TODO: support more features (querystrings, seq numbers, etc)
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  return this.mock
    .get('/_all_docs')
    .reply(this.mock.status.OK, generate(options), {
      // NOTE: this looks like a CouchDB bug
      // @see https://issues.apache.org/jira/browse/COUCHDB-2570
      'Content-Type': 'text/plain'
    });
};

function generate(options) {
  var total = options.total || chance.natural({ max: 1000 });
  var count = options.count || chance.natural({ max: total });
  var offset = options.offset || chance.natural({ max: total - count });

  return {
    offset: offset,
    rows: chance.n(row, count),
    total_rows: total
  }
}

function row() {
  var id = chance.docId();
  return {
    id: id,
    key: id,
    value: { rev: chance.rev() }
  };
}
