var chance = require('chance').Chance();
var defaults = require('defaults');

chance.mixin({
  rev: function () {
    return chance.natural({ max: 25 }) + '-' + chance.hash();
  }
});

exports.get = function (id, data) {
  return defaults(data, {
    _id: id || chance.guid(),
    _rev: chance.rev()
  });
}
