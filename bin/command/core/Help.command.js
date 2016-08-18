'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase.class');

const Command = SYS.use('bin/command/Command.class');

/**
  * @Command(
  *   alias=["help"],
  *   description=["Help for commands"]
  * )
  */
module.exports = class HelpCommand extends CommandBase {

  /**
    * @Command
    */
  command(name) {
    var data = Command.getCommand(name);

    if (data) {
      this.log('Command:     ' + data.command.name());
      this.log('Alias:       ' + data.info.alias.join(', '));
      this.log('File:        ' + data.info.path.resolve());

      if (data.info.annotation.getDefinitions('Command')[0].description.length) {
        this.log('Description: ');
        for (var i in data.info.annotation.getDefinitions('Command')[0].description) {
          this.log('  ' + data.info.annotation.getDefinitions('Command')[0].description[i]);
        }
      }
    } else {
      this.error('No command found with name "' + name + '"');
    }
  }

}