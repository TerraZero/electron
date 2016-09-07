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

  /**
    * @Command(
    *   params={
    *     key: {type: "string"}
    *   }
    * )
    */
  test(key) {
    var User = SYS.route('entity.user');
    console.log(User.__route);
    var u = new User();
    console.log(u.constructor.__route);
  }

  /**
    * @Command
    */
  builder() {
    var User = SYS.route('entity.user');
    var u = new User();
    u.on('test').on('cool');
  }

  /**
    * @Command
    */
  options() {
    SYS.route('logger').options('Test: ', ['option 1', 'option 2', 'option 3']);
  }

}