'use strict';

const Command = SYS.use('Command.base');

/**
  * @Command(
  *   alias=["test"]
  * )
  */
module.exports = class TestCommand extends Command {

  /**
    * @Command(
    *   params={
    *     type: {type: "string"}
    *   }
    * )
    */
  entities(type) {
    if (!type) type = this.input('Type: ');

    var loader = SYS.get('entity');

    var entity = loader.entity(type);
    var controller = loader.controller(type);

    controller.load(null, entity, function(entities, rows) {
      console.log(entities);
    });

    var u = new entity();
    u.name = 'Terra';
    controller.save([u], function(entities, rows, query) {
      console.log(entities);
    });
  }

}