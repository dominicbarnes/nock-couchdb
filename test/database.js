var assert = require('assert');
var mock = require('..');

describe('database', function () {
  var server = mock.server();
  var database = server.database('test');

  it('should store some references', function () {
    assert.strictEqual(database.server, server);
  });

  it('should store the name as a property', function () {
    assert.equal(database.name, 'test');
  });

  describe('1.6.1', require('./1.6.1/database'));
});
