var assert = require('assert');
var mock = require('..');

describe('document', function () {
  var server = mock.server();
  var database = server.database('test');
  var document = database.document('test');

  it('should store some references', function () {
    assert.strictEqual(document.database, database);
    assert.strictEqual(document.server, server);
  });

  it('should store the id as a property', function () {
    assert.equal(document.id, 'test');
  });

  describe('1.6.1', require('./1.6.1/document'));
});
