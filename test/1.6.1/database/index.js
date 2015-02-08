
module.exports = function () {
  describe('.info([options])', require('./info'));
  describe('.exists([options])', require('./exists'));
  describe('.create([options])', require('./create'));
  describe('.delete([options])', require('./delete'));
  describe('.allDocs([options])', require('./all-docs'));
  describe('.compact([options])', require('./compact'));
  describe('.ensureFullCommit([options])', require('./ensure-full-commit'));
  describe('.viewCleanup([options])', require('./view-cleanup'));
};
