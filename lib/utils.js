
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
  rev: function () {
    return chance.natural({ max: 99 }) + '-' + chance.hash();
  }
});

exports.chance = chance;

/**
 * Creates a config object with default values.
 */

exports.defaults = function (a, b) {
  return extend({}, b, a);
};

/**
 * Quick helper for determining the length of a JSON body.
 *
 * @param {Object} body
 * @returns {Number}
 */

exports.len = function (body) {
  return JSON.stringify(body).length;
};
