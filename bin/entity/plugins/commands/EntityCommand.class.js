'use strict';

const Command = SYS.use('Command.base');

/**
  * @Command(
  *   alias=["entity"]
  * )
  */
module.exports = class EntityCommand extends Command {

  /**
    * @Command(
    *   params={
    *     type: {type: "string"}
    *   }
    * )
    */
  add(type) {
    if (!type) type = this.input('Type: ');

    var Entity = SYS.get('entity.' + type);
    var row = Entity.createRowCLI();

    var output = [];
    for (var i in row) {
      output.push([i, row[i]]);
    }
    this.table(output);

    var submit = this.input('Add entity "' + type + '" (y/n): ');

    if (submit == 'y') {
      var entity = new Entity(row);

      Entity.controller().save([entity], function(entities) {
        var rows = entities[0].log();

        rows.unshift(['Type', entities[0].type()]);
        SYS.get('logger').table(rows);
      });
    } else {
      this.error('Aborting');
    }
  }

  /**
    * @Command(
    *   params={
    *     type: {type: "string"},
    *     'ids': {type: "number...", value: "[]"}
    *   }
    * )
    */
  load(type) {
    var ids = TOOLS.args(arguments, 1);

    if (ids.length == 0) ids = null;
    if (!type) type = this.input('Type: ');

    var Entity = SYS.get('entity.' + type);
    var options = {};

    if (this.args().offset) {
      options.offset = this.args().offset;
    }
    if (this.args().limit) {
      options.limit = this.args().limit;
    }

    SYS.get('database').checkOptions(options);

    Entity.controller().load(ids, Entity, function(entities) {
      var head = [];
      var rows = [];
      var fields = Entity.controller().fields();

      for (var i in fields) {
        head.push(fields[i].name());
      }

      for (var i in entities) {
        var row = [];

        for (var f in fields) {
          row.push(entities[i][f]);
        }
        rows.push(row);
      }

      SYS.get('logger').table({head: head, rows: rows});
    }, options);
  }

  /**
    * @Command(
    *   params={
    *     type: {type: "string"},
    *     'ids': {type: "number...", value: "[]"}
    *   }
    * )
    */
  remove(type) {
    var ids = TOOLS.args(arguments, 1);

    if (!type) type = this.input('Type: ');
    if (ids.length == 0) {
      ids = this.input('IDs: ');
      if (ids.length == 0) {
        ids = null;
      } else {
        ids = ids.split(',');
        for (var i in ids) {
          ids[i] = ids[i].trim();
        }
      }
    }

    var submit = false;

    if (ids == null) {
      submit = this.input('Delete all entities from type "' + type + '" (y/n): ');
    } else {
      this.out('Delete ids: ' + ids.join(', '));
      submit = this.input('Delete entities from type "' + type + '" (y/n): ');
    }

    if (submit != 'y') {
      this.error('Aborting');
      return;
    }

    var Entity = SYS.get('entity.' + type);
    // TODO delete
  }

}