var assert = require('assert');
var mock = require('..');

describe('local-document', function () {
  var server = mock.server();
  var database = server.database('test');
  var document = database.localDocument('test');

  it('should store some references', function () {
    assert.strictEqual(document.database, database);
    assert.strictEqual(document.server, server);
  });

  it('should store the name and id as a properties', function () {
    assert.equal(document.name, 'test');
    assert.equal(document.id, '_local/test');
  });

  describe('1.6.1', require('./1.6.1/local-document'));
});
