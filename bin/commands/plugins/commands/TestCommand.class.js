'use strict';

const Command = SYS.route('base.command');

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

    var loader = SYS.route('entity');

    var Entity = loader.entity(type);
    var Controller = Entity.controller();

    console.log(Controller.load);
  }

}