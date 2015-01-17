
/**
 * Module dependencies.
 */

var Document = require('./document');
var nock = require('nock');
var path = require('path');
var random = require('./random/database');

/**
 * Single export.
 */

module.exports = Database;


/**
 * Wraps nock for a fake CouchDB Database.
 */

function Database(server, name) {
  if (!(this instanceof Database)) return new Database(server, name);

  this.name = name;
  this.server = server;
}

Database.prototype.url = function () {
  return [ '', this.name ].concat([].slice.call(arguments)).join('/');
};

Database.prototype.info = function (data) {
  this.server.nock
    .get(this.url())
    .reply(200, random.info(this.name, data));
};

Database.prototype.document = function (id) {
  return new Document(this, id);
};
