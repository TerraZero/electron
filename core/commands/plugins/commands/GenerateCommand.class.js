'use strict';

const Command = SYS.route('base.command');
const FS = SYS.node('graceful-fs');

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

    var name = this.input('string', 'Name');
    var path = TOOLS.path(this.input('string', 'Path ', ':core/'));
    var file = new TOOLS.File('$' + path.resolve() + name.toLowerCase());

    if (!this.confirm('Generate module in "' + file.file() + '"')) return;

    if (file.mkdir()) {
      this.success('Module created!');
    }
  }

}