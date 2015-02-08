
/**
 * Module dependencies.
 */

var utils = require('../../utils');

var chance = utils.chance;
var defaults = utils.defaults;

/**
 * GET /_active_tasks
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--_active_tasks
 *
 * When `tasks` is not defined, a list of 1-10 items will be used. When
 * a `Number`, a list of that length will be used.
 *
 * Available `options`:
 *  - count {Number}  Amount of tasks to render
 *  - error {Number}  Status code of error
 *
 * @param {Object} options
 */

module.exports = function (options) {
  var o = defaults(options, {
    count: chance.natural({ min: 1, max: 10 })
  });

  var status = this.mock.status;
  var req = this.mock
    .get('/_active_tasks')
    .matchHeader('Accept', 'application/json');

  if (o.error === status.FORBIDDEN) {
    req.reply(status.FORBIDDEN, {
      error:  'unauthorized',
      reason: 'You are not a server admin.'
    });
  } else {
    req.reply(status.OK, chance.n(task, o.count));
  }
};

/**
 n* Each generator function here will work for a specific type of active task,
 * these examples are taken right from the docs, so they may not match the
 * real-world 100% of the time.
 */

var generators = {
  database_compaction: function () {
    return {
      changes_done:  chance.natural({ max: 99999 }),
      database:      chance.word(),
      pid:           chance.pid(),
      progress:      chance.progress(),
      started_on:    chance.timestamp(),
      total_changes: chance.natural({ max: 99999 }),
      type:          'database_compaction',
      updated_on:    chance.timestamp()
    };
  },

  indexer: function () {
    return {
      changes_done:    chance.natural({ max: 99999 }),
      database:        chance.word(),
      design_document: chance.hash(),
      pid:             chance.pid(),
      progress:        chance.progress(),
      started_on:      chance.timestamp(),
      total_changes:   chance.natural({ max: 99999 }),
      type:            'indexer',
      updated_on:      chance.timestamp()
    };
  },

  replication: function () {
    return {
      checkpointed_source_seq: chance.natural({ max: 99999 }),
      continuous:              chance.bool(),
      doc_id:                  chance.guid(),
      doc_write_failures:      chance.natural({ max: 100 }),
      docs_read:               chance.natural({ max: 9999 }),
      docs_written:            chance.natural({ max: 9999 }),
      missing_revisions_found: chance.natural({ max: 9999 }),
      pid:                     chance.pid(),
      progress:                chance.progress(),
      replication_id:          chance.guid(),
      revisions_checked:       chance.natural({ max: 9999 }),
      source:                  chance.word(),
      source_seq:              chance.natural({ max: 99999 }),
      started_on:              chance.timestamp(),
      target:                  chance.word(),
      type:                    'replication',
      updated_on:              chance.timestamp()
    };
  },

  view_compaction: function () {
    return {
      changes_done:  chance.natural({ max: 9999 }),
      database:      chance.word(),
      pid:           chance.pid(),
      progress:      chance.progress(),
      started_on:    chance.timestamp(),
      total_changes: chance.natural({ max: 9999 }),
      type:          'database_compaction',
      updated_on:    chance.timestamp()
    };
  }
};

var types = Object.keys(generators);

/**
 * Generates a single active task object.
 *
 * @returns {Object}
 */

function task() {
  var type = chance.pick(types);
  return generators[type]();
}
