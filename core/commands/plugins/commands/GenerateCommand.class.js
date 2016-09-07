'use strict';

const Command = SYS.route('base.command');

/**
  * @Command(
  *   alias=["gen"]
  * )
  */
module.exports = class GenerateCommand extends Command {

  /**
    * @Command
    */
  module() {
    this.out('Generate Module');

    // var name = this.input('string', 'Name');
    // var path = this.input('string', 'Path ', ':mods/');
    var t = this.options('Hallo', ['cool', 'hallo']);

    // var path = new TOOLS.Path(path);

    // this.out(name);
    // this.out(path.resolve());
  }

}