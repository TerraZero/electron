'use strict';

const Command = use('base.command');
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

    let name = this.input('string', 'Name');
    let path = TOOLS.path(this.input('string', 'Path ', ':core/'));
    let file = new TOOLS.File('$' + path.resolve() + name.toLowerCase());

    if (!this.confirm('Generate module in "' + file.file() + '"')) return;

    if (file.mkdir()) {
      this.success('Module created!');
    }
  }

}