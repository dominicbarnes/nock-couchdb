var chance = require('chance').Chance();

chance.mixin({
  semver: function () {
    return chance.n(chance.natural, 3, { max: 9 }).join('.');
  }
});

exports.info = function (version) {
  return {
    couchdb: 'Welcome',
    version: version || chance.semver()
  };
};
