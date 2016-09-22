'use strict';

const CommandBase = use('base.command');
const Command = use('command');

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
    if (!name) name = this.input('string', 'Command');

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
      var rows = [];

      rows.push(['Command', data.command.name()]);
      rows.push(['Alias', data.info.alias.join(', ')]);
      rows.push(['File', data.info.path.resolve()]);

      if (data.info.annotation.getDefinitions('Command')[0].description.length) {
        for (var i in data.info.annotation.getDefinitions('Command')[0].description) {
          if (i == 0) {
            rows.push(['Description', data.info.annotation.getDefinitions('Command')[0].description[i]]);
          } else {
            rows.push(['', data.info.annotation.getDefinitions('Command')[0].description[i]]);
          }
        }
      }

      this.table(rows);
    } else {
      this.error('No command found with name "' + name + '"');
    }
  }

  commandMethodHelp(name, method) {
    var data = Command.getCommand(name);

    if (data) {
      var rows = [];

      rows.push(['Command', data.command.name()]);

      var founds = Command.getFunction(data.info.annotation, method);

      for (var i in founds) {
        rows.push([]);
        rows.push(['Function', founds[i].target]);
        if (founds[i].alias.length) {
          rows.push(['Alias', founds[i].alias.join(', ')]);
        }
        if (founds[i].description.length) {
          for (var d in founds[i].description) {
            if (d == 0) {
              rows.push(['Description', founds[i].description[d]]);
            } else {
              rows.push(['', founds[i].description[d]]);
            }
          }
        }

        var first = true;
        for (var param in founds[i].params) {
          if (first) {
            first = false;
            rows.push(['Params', '(' + (founds[i].params[param].value === undefined ? '' : 'optional:') + founds[i].params[param].type + ') ' + param + ': ' + (founds[i].params[param].value == null ? 'null' : founds[i].params[param].value)])
          } else {
            rows.push(['', '(' + (founds[i].params[param].value === undefined ? '' : 'optional:') + founds[i].params[param].type + ') ' + param + ': ' + (founds[i].params[param].value == null ? 'null' : founds[i].params[param].value)])
          }
        }

        rows.push(['Options:', '']);
        for (var option in founds[i].options) {
          if (founds[i].options[option].type == 'boolean') {
            rows.push(['  -' + option, '(' + founds[i].options[option].type + ') ' + founds[i].options[option].description]);
          } else {
            rows.push(['  --' + option, '(' + founds[i].options[option].type + ') ' + founds[i].options[option].description]);
          }
        }
      }

      this.table(rows);
    } else {
      this.error('No command found with name "' + name + '"');
    }
  }

}