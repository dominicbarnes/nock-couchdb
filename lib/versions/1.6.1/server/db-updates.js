
/**
 * Module dependencies.
 */

var extract = require('extract');
var inherits = require('util').inherits;
var Readable = require('stream').Readable;
var url = require('url');
var utils = require('../../../utils');

var chance = utils.chance;
var defaults = utils.defaults;


/**
 * GET /_db_updates
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--_db_updates
 *
 * Available `options`:
 *  - feed {String}
 *  - error {Number}
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  if (!options) options = {};

  function stream() {
    return new ChangesStream(options);
  }

  var req = this.mock
    .get(url.format({
      pathname: '/_db_updates',
      query:    extract(options, [ 'feed', 'timeout', 'heartbeat' ])
    }))
    .matchHeader('Accept', 'application/json');

  var status = this.mock.status;

  if (options.error === status.UNAUTHORIZED) {
    req.reply(status.UNAUTHORIZED, {
      error:  'unauthorized',
      reason: 'You are not a server admin.'
    })
  } else {
    req.reply(status.OK, stream, {
      'Content-Type':      'application/json',
      'Transfer-Encoding': 'chunked'
    });
  }
};

/**
 * Mocks a changes feed.
 */

function ChangesStream(options) {
  Readable.call(this);
  this.options = defaults(options, {
    feed: 'longpoll',
    delay: 250
  });
}

/**
 * Set up inheritance.
 */

inherits(ChangesStream, Readable);

/**
 * Mocks the read interface of the stream, and delegates to prototype methods
 * for the actual logic.
 */

ChangesStream.prototype._read = function () {
  this[this.options.feed]();
};

/**
 * Determines the delay to the next action. If a number, it will be static.
 * If an object, it will be passed to chance to generate a random number.
 */

ChangesStream.prototype.delay = function () {
  var delay = this.options.delay;
  if (typeof delay === 'number') return delay;
  return chance.natural(delay);
}

/**
 * Low-level method that writes a new change object.
 */

ChangesStream.prototype.change = function () {
  this.push(JSON.stringify(generate()));
};

/**
 * This will `delay` and then respond.
 */

ChangesStream.prototype.longpoll = function () {
  var self = this;
  var delay = this.delay();

  setTimeout(function () {
    self.change();
    self.push(null);
  }, delay);
};

/**
 * This will `delay` and respond continuously until it hits the `timeout`.
 */

ChangesStream.prototype.continuous = function () {
  // TODO
};

/**
 * TODO
 */

ChangesStream.prototype.eventsource = function () {
  // TODO
};

/**
 * Generates a random db change object.
 *
 * @returns {Object}
 */

function generate() {
  return {
    db_name: chance.dbName(),
    ok: true,
    type: chance.pick([ 'created', 'updated', 'deleted', 'compacted' ])
  }
}
