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
    * @Command(
    *   params={
    *     name: {type: "string"}
    *   }
    * )
    */
  command(name) {
    if (!name) return this.error('Error');

    name = name.split('.');
    if (name.length == 1) {
      this.commandHelp(name[0]);
    } else if (name.length == 2) {
      this.commandMethodHelp(name[0], name[1]);
    }
  }

  commandHelp(name) {
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

  commandMethodHelp(name, method) {
    var data = Command.getCommand(name);

    if (data) {
      this.log('Command:  ' + data.command.name());
      this.log();

      var founds = Command.getFunction(data.info.annotation, method);

      for (var i in founds) {
        this.log('---------------------------------------');
        this.log('Function: ' + founds[i].target);
        if (founds[i].alias.length) {
          this.log('Alias:    ' + founds[i].alias.join(', '));
        }
        if (founds[i].description.length) {
          this.log('Description:');
          for (var d in founds[i].description) {
            this.log('  ' + founds[i].description[d]);
          }
        }
        this.log('Params:');
        for (var param in founds[i].params) {
          this.log('  (' + (founds[i].params[param].value === undefined ? '' : 'optional:') + founds[i].params[param].type + ') ' + param + ': ' + (founds[i].params[param].value == null ? 'null' : founds[i].params[param].value));
        }
      }
      this.log('---------------------------------------');
    } else {
      this.error('No command found with name "' + name + '"');
    }
  }

}