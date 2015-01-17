
/**
 * Module dependencies.
 */

var nock = require('nock');
var random = require('./random/server');
var Database = require('./database');

/**
 * Single export.
 */

module.exports = Server;


/**
 * Wraps nock for a fake CouchDB server.
 *
 * @param {String} [href]  Default: http://localhost:5984/
 */

function Server(href) {
  if (!(this instanceof Server)) return new Server(href);

  this.base = href || 'http://localhost:5984/';
  this.nock = nock(this.base);
}

Server.prototype.done = function () {
  return this.nock.isDone();
};

Server.prototype.clean = function () {
  return nock.cleanAll();
};

Server.prototype.pending = function () {
  this.nock.pendingMocks();
};

Server.prototype.info = function (version) {
  this.nock
    .get('/')
    .reply(200, random.info(version));
};

Server.prototype.database = function (name) {
  return new Database(this, name);
};
