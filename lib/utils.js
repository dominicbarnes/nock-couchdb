
/**
 * Module dependencies.
 */

var Chance = require('chance');
var extend = require('extend');

/**
 * Access to a chance instance
 *
 * TODO: add mixins and other config
 */

var chance = new Chance();

chance.mixin({

  /**
   * Generates a random database name following the rules specified in the
   * documentation.
   *
   * @see http://docs.couchdb.org/en/1.6.1/api/database/common.html#put--db
   *
   * @returns {String}
   */

  dbName: function () {
    var lead = chance.character({
      alpha:  true,
      casing: 'lower'
    });

    var rest = chance.string({
      pool:   'abcdefghijklmnopqrstuvwxyz0123456789_$()+/-',
      length: chance.natural({ min: 9, max: 24 })
    });

    return lead + rest;
  },

  /**
   * Generates a random document id based on the following allowed rules.
   *
   * TODO: consider allowing generation via the other UUID algorithms.
   * @see http://docs.couchdb.org/en/1.6.1/config/misc.html#uuids/algorithm
   *
   * @returns {String}
   */

  docId: function () {
    return chance.uuid();
  },

  /**
   * Generates a random ETag hash. (Use `chance.rev()` when generating an ETag
   * for a document.
   *
   * @returns {String}
   */

  etag: function () {
    return chance.hash({
      length: 25,
      casing: 'upper'
    });
  },

  /**
   * Pick a random HTTP method from the list of those that CouchDB accepts.
   * @see http://docs.couchdb.org/en/1.6.1/api/basics.html?highlight=status%20codes#request-format-and-responses
   *
   * @returns {String}
   */

  httpMethod: function () {
    return chance.pick([ 'HEAD', 'GET', 'PUT', 'POST', 'DELETE', 'COPY' ]);
  },

  /**
   * Pick a random HTTP status from the list of those that CouchDB may use.
   * @see http://docs.couchdb.org/en/1.6.1/api/basics.html?highlight=status%20codes#http-status-codes
   *
   * @returns {Number}
   */

  httpStatus: function () {
    return chance.pick([
      200, 201, 202,
      304,
      400, 401, 403, 404, 405, 406, 409, 412, 415, 416, 417,
      500
    ]);
  },

  /**
   * Returns a random system pid number. (at least using the same format that
   * CouchDB seems to use)
   *
   * @returns {String}
   */

  pid: function () {
    var x = chance.natural({ max: 9 });
    var y = chance.natural({ min: 1000, max: 99999 });
    var z = chance.natural({ max: 9 });
    return `<${x}.${y}.${z}>`;
  },

  /**
   * Generates a float corresponding to a percent-completion status.
   *
   * @returns {Number}
   */

  progress: function () {
    chance.floating({
      min:   0,
      max:   100,
      fixed: 2
    });
  },

  /**
   * Generates a random CouchDB rev number
   *
   * @returns {String}
   */

  rev: function () {
    var x = chance.natural({ max: 99 });
    var y = chance.hash();
    return `${x}-${y}`;
  },

  /**
   * Generates a random URL path.
   *
   * TODO: generate a more realistic URL using things like dbName and docId
   *
   * @returns {String}
   */

  urlPath: function () {
    var parts = [];
    while (parts.length < 5) {
      if (chance.bool({ likelihood: 25 })) break;
      parts.push(chance.word());
    }
    return '/' + parts.join('/');
  },

  /**
   * Generates a UUID, following the given `algorithm`.
   *
   * @returns {String}
   */

  uuid: function () {
    return chance.hash({ length: 32 });
  }

});

exports.chance = chance;

/**
 * Clones an input object.
 */

exports.clone = function (input, shallow) {
  return extend(!shallow, {}, input);
};

/**
 * Creates a config object with default values.
 *
 * @param {Object} [input]
 * @param {Object} defaults
 * @returns {Object}
 */

exports.defaults = function (input, defaults) {
  return extend({}, defaults, input);
};
