
/**
 * Module dependencies.
 */

var assert = require('assert');
var Database = require('./database');
var extend = require('extend');
var Mock = require('./mock');

/**
 * Single export.
 */

module.exports = Server;

/**
 * Wraps nock for a fake CouchDB server.
 *
 * @param {String} [options]
 */

function Server(options) {
  // do not require "new"
  if (!(this instanceof Server)) return new Server(options);

  // initialize config
  var o = this.options = extend({}, Server.defaults, options);

  // ensure we have the right options configured
  assert(o.url);
  assert(o.version);

  // extend this object with the correct methods for this version
  extend(this, require(`./${o.version}/server`));

  // call the constructor for the mixin
  this.mock = new Mock(o);
}

/**
 * Default options.
 */

Server.defaults = {
  // the root URL for the server
  url: 'http://localhost:5984/',

  // the version of the server to mock
  version: '1.6.1',

  // the date used by the Mock for the `Date` header
  date: new Date()
};

/**
 * Add some helper methods from the mock lib.
 */

Mock.mixin(Server.prototype);

/**
 * Beget a database object from this server.
 *
 * @param {String} name
 * @returns {Database}
 */

Server.prototype.database = function (name) {
  return new Database(this, name);
};
