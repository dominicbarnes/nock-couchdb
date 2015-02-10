
/**
 * Export the directory.
 *
 * Some methods are shared with Document.
 */

var document = require('../document');

exports.exists = document.exists;
exports.get = document.get;
exports.save = document.save;
exports.delete = document.delete;
// exports.copy = document.copy;
exports.info = require('./info');
