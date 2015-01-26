
/**
 * Module dependencies.
 */

var assert = require('assert');
var extend = require('extend');
var nock = require('nock');
var url = require('url');

/**
 * Single export.
 */

module.exports = Mock;

/**
 * Wraps the nock library and adds some convenience helpers for it that is
 * domain-specific for nock-couchdb
 *
 * @constructor
 * @param {Object} options
 */

function Mock(options) {
  if (!(this instanceof Mock)) return new Mock(options);

  // set up the config
  var o = this.options = extend({}, options);

  // ensure we have the right options configured
  assert(o.url);
  assert(o.version);

  // add a helper method for getting a url relative to the base
  this.url = url.resolve.bind(url, o.url);

  // creates a pre-configured nock instance
  this.nock = nock(o.url)
    .replyContentLength()
    .replyDate(o.date)
    .defaultReplyHeaders({
      'Cache-Control': 'must-revalidate',
      'Server':        `CouchDB/${o.version} (Erlang/OTP)`
    });
}

/**
 * Proxy methods for the nock instance.
 */

var methods = [ 'done', 'get', 'post', 'put', 'head', 'delete' ];

methods.forEach(function (method) {
  Mock.prototype[method] = function () {
    return this.nock[method].apply(this.nock, arguments);
  };
});

/**
 * Adds some additional mixin methods for working with mocks.
 */

Mock.mixin = function (target) {
  target.url = function (href) {
    return this.mock.url(href || '');
  };

  target.done = function () {
    this.mock.done();
  };
};
