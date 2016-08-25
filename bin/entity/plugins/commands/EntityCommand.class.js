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
    if (!type) type = CLI.input('Type: ');

    var Entity = SYS.get('entity.' + type);
    var row = Entity.createRowCLI();

    var output = [];
    for (var i in row) {
      output.push([i, row[i]]);
    }
    CLI.table(output);

    var submit = CLI.input('Add entity "' + type + '" (y/n): ');

    if (submit == 'y') {
      var entity = new Entity(row);

      Entity.controller().save([entity], function(entities) {
        var rows = entities[0].log();

        rows.unshift(['Type', entities[0].type()]);
        CLI.table(rows);
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
    if (!type) type = CLI.input('Type: ');

    var Entity = SYS.get('entity.' + type);

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

      CLI.table({head: head, rows: rows});
    });
  }

}