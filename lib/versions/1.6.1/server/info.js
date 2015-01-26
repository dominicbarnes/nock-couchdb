
/**
 * GET /
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--
 */

module.exports = function () {
  return this.mock
    .get('/')
    .reply(200, {
      couchdb: 'Welcome',
      version: this.options.version
    });
};
