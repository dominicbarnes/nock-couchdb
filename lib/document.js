
/**
 * Module dependencies.
 */

var assert = require('assert');
var extend = require('extend');
var Mock = require('./mock');

/**
 * Single export.
 */

module.exports = Document;

/**
 * Represents a CouchDB document.
 *
 * @constructor
 * @param {Server} server
 * @param {String} name
 */

function Document(database, id) {
  if (!(this instanceof Document)) return new Document(database, id);

  // ensure we have the right params
  assert(database);

  // store references to this instance
  this.server = database.server;
  this.database = database;
  this.id = id;
  var o = this.options = extend({}, database.options);

  // generate the right url for the document
  o.url = database.mock.url(id ? (id + '/') : '');

  // extend this object with the correct methods for this version
  extend(this, require(`./${o.version}/document`));

  // create a Mock instance specific to this
  this.mock = new Mock(o);
}

/**
 * Add some helper methods from the mock lib.
 */

Mock.mixin(Document.prototype);
