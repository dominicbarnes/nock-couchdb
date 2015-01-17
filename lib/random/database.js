var chance = require('chance').Chance();
var defaults = require('defaults');

exports.info = function (name, data) {
  return defaults(data, {
    committed_update_seq: chance.natural(),
    compact_running:      chance.bool(),
    data_size:            chance.natural(),
    db_name:              name || chance.word(),
    disk_format_version:  chance.natural({ max: 10 }),
    disk_size:            chance.natural(),
    doc_count:            chance.natural({ max: 1000 }),
    doc_del_count:        chance.natural({ max: 100 }),
    instance_start_time:  chance.hammertime().toString(),
    purge_seq:            chance.natural({ max: 100 }),
    update_seq:           chance.natural({ max: 10000 })
  });
}
