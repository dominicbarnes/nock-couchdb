
/**
 * Module dependencies.
 */

var inherits = require('util').inherits;
var Readable = require('stream').Readable;
var qs = require('querystring');
var chance = require('../../../utils').chance;

/**
 * GET /_log
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--_log
 *
 * Supported `options` parameters:
 *  - bytes {Number}
 *  - offset {Number}
 *
 * @param {Object} [options]
 */

module.exports = function (options) {
  var url = '/_log';
  if (options) url += qs.stringify(options);

  function stream() {
    return new LogStream(options);
  }

  this.mock
    .get(url)
    .reply(200, stream, {
      'Content-Type':      'text/plain',
      'Transfer-Encoding': 'chunked'
    });
};

/**
 * A readable stream implementaiton that acts like it's reading a log file.
 *
 * @constructor
 * @param {Object} [options]
 */

function LogStream(options) {
  Readable.call(this);
  if (!options) options = {};
  this.bytes = options.bytes || 1000;
  this.offset = options.offset || 0;
  this.written = 0;
}

/**
 * Set up inheritance.
 */

inherits(LogStream, Readable);

/**
 * Processes the read portion of the stream.
 *
 * @param {Number} size
 */

LogStream.prototype._read = function (size) {
  var written = 0;
  while (written < size) {
    var line = generate();

    var remaining = this.remaining();
    if (line.length > remaining) line = line.slice(0, remaining);

    this.push(line);
    written += line.length;
    this.written += line.length;

    if (!this.remaining()) {
      this.push(null);
      break;
    }
  }
};

/**
 * Check how many bytes we have left.
 *
 * @returns {Boolean}
 */

LogStream.prototype.remaining = function () {
  return this.bytes - this.written;
};

/**
 * Generates a single line of log output.
 *
 * @returns {String}
 */

function generate() {
  var ts = chance.date();
  var lvl = chance.pick([ 'info', 'warning', 'error' ]);
  var pid = chance.pid();
  var ip = chance.ip();
  var verb = chance.httpMethod();
  var path = chance.urlPath();
  var status = chance.httpStatus();

  return `[${ts}] [${lvl}] [${pid}] ${ip} - - '${verb}' ${path} ${status}\n`;
}
