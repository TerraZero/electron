'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase.class');

const Command = SYS.use('bin/command/Command.class');

module.exports = class HelpCommand extends CommandBase {

  static alias() {
    return 'help';
  }

  test() {
    var t = new TOOLS.Annotation(new TOOLS.Path('./Find.command'));
    this.out(t.getMethods());
  }

}