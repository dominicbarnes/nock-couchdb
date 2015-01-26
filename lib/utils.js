
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
