'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase.class');

const Command = SYS.use('bin/command/Command.class');

/**
  * @Command(
  *   alias=["help"]
  * )
  */
module.exports = class HelpCommand extends CommandBase {

  /**
    * @Command
    */
  command(name) {
    var data = Command.getCommand(name);

    if (data) {
      this.log('Command: ' + data.command.name());
      this.log('Alias:   ' + data.info.alias.join(', '));
      this.log('File:    ' + data.info.path.resolve());
    } else {
      this.error('No command found with name "' + name + '"');
    }
  }

}