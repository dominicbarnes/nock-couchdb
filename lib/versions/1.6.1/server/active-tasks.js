
/**
 * Module dependencies.
 */

var utils = require('../../../utils');
var zeroes = require('zeroes');

var chance = utils.chance;
var len = utils.len;

/**
 * Each generator function here will work for a specific type of active task,
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
 * GET /_active_tasks
 * @see http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--_active_tasks
 *
 * When `tasks` is not defined, an empty list will be returned. When a `Number`,
 * a list of that length will be used. When an `Array` of `Objects` is used, it
 * will use that list exactly.
 *
 * @param {Number|Array:Object} tasks
 */

module.exports = function (count) {
  if (typeof count === 'undefined') {
    count = chance.natural({ min: 1, max: 10 });
  }

  var body = zeroes(count, function () {
    var type = chance.pick(types);
    return generators[type]();
  });

  return this.mock
    .get('/_active_tasks')
    .reply(200, body, {
      'Content-Length': len(body)
    });
};
