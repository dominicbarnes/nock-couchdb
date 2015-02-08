
/**
 * Module dependencies.
 */

var assert = require('assert');
var extend = require('extend');
var Mock = require('./mock');

/**
 * Single export.
 */

module.exports = Database;

/**
 * Represents a CouchDB database.
 *
 * @constructor
 * @param {Server} server
 * @param {String} name
 */

function Database(server, name) {
  if (!(this instanceof Database)) return new Database(server, name);

  // ensure we have the right params
  assert(server);
  assert(name);

  // store references to this instance
  this.server = server;
  this.name = name;
  var o = this.options = extend({}, server.options);

  // generate the right url for the database
  o.url = server.mock.url(`/${name}/`);

  // extend this object with the correct methods for this version
  extend(this, require(`./${o.version}/database`));

  // create a Mock instance specific to this
  this.mock = new Mock(o);
}

/**
 * Add some helper methods from the mock lib.
 */

Mock.mixin(Database.prototype);
