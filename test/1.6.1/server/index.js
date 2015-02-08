module.exports = function () {
  describe('.info()', require('./info'));
  describe('.activeTasks([options])', require('./active-tasks'));
  describe('.allDbs([options])', require('./all-dbs'));
  describe('.dbUpdates([options])', require('./db-updates'));
  describe('.log([options])', require('./log'));
  describe('.restart([options])', require('./restart'));
  describe('.stats([options])', require('./stats'));
  describe('.uuids([options])', require('./uuids'));
};
