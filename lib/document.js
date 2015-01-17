
/**
 * Module dependencies.
 */

var nock = require('nock');
var path = require('path');
var random = require('./random/document');

/**
 * Single export.
 */

module.exports = Document;


/**
 * Wraps nock for a fake CouchDB Document.
 */

function Document(database, id) {
  if (!(this instanceof Document)) return new Document(database, id);

  this.id = id;
  this.database = database;
  this.server = database.server;
}

Document.prototype.url = function () {
  var args = [].slice.call(arguments);
  return [ '', this.database.name, this.id ].concat(args).join('/');
}

Document.prototype.get = function (data) {
  this.server.nock
    .get(this.url())
    .reply(200, random.get(this.id, data));
};
