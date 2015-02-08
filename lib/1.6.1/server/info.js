
/**
 * GET /
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--
 */

module.exports = function () {
  this.mock
    .get('/')
    .matchHeader('Accept', 'application/json')
    .reply(this.mock.status.OK, {
      couchdb: 'Welcome',
      version: this.options.version
    });
};
