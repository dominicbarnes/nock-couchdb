
/**
 * Module dependencies.
 */

var assert = require('assert');
var extend = require('extend');
var Mock = require('./mock');

/**
 * Single export.
 */

module.exports = DesignDocument;

/**
 * Represents a CouchDB document.
 *
 * @constructor
 * @param {Database} database
 * @param {String} name
 */

function DesignDocument(database, name) {
  if (!(this instanceof DesignDocument)) {
    return new DesignDocument(database, name);
  }

  // ensure we have the right params
  assert(database);
  assert(name);

  // store references to this instance
  this.server = database.server;
  this.database = database;
  this.name = name;
  this.id = `_design/${name}`;
  var o = this.options = extend({}, database.options);

  // generate the right url for the document
  o.url = database.mock.url(`${this.id}/`);

  // extend this object with the correct methods for this version
  extend(this, require(`./${o.version}/design-document`));

  // create a Mock instance specific to this
  this.mock = new Mock(o);
}

/**
 * Add some helper methods from the mock lib.
 */

Mock.mixin(DesignDocument.prototype);
