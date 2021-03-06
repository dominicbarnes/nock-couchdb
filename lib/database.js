
/**
 * Module dependencies.
 */

var assert = require('assert');
var DesignDocument = require('./design-document');
var Document = require('./document');
var extend = require('extend');
var LocalDocument = require('./local-document');
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

/**
 * Beget a document object from this server.
 *
 * @param {String} id
 * @returns {Document}
 */

Database.prototype.document = function (id) {
  return new Document(this, id);
};

/**
 * Beget a design document object from this server.
 *
 * @param {String} id
 * @returns {DesignDocument}
 */

Database.prototype.designDocument = function (id) {
  return new DesignDocument(this, id);
};

/**
 * Beget a local document object from this server.
 *
 * @param {String} id
 * @returns {DesignDocument}
 */

Database.prototype.localDocument = function (id) {
  return new LocalDocument(this, id);
};
