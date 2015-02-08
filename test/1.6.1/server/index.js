module.exports = function () {
  describe('.info()', require('./info'));
  describe('.activeTasks([options])', require('./active-tasks'));
  describe('.allDbs([options])', require('./all-dbs'));
  describe('.dbChanges([options])', require('./db-changes'));
  describe('.log([options])', require('./log'));
  describe('.restart([options])', require('./restart'));
  describe('.stats([options])', require('./stats'));
  describe('.uuids([options])', require('./uuids'));
};
