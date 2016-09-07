'use strict';

const CommandBase = SYS.use('Command.base');

// load commands
const commands = (function registerCommands() {
  var plugins = SYS.plugins('Command');
  var result = [];

  for (var i in plugins) {
    result.push({
      path: plugins[i].path,
      annotation: plugins[i].annotation,
      alias: plugins[i].annotation.getDefinitions('Command')[0].alias,
    });
  }
  return result;
})();

/**
  * @SysRoute(
  *   value="command",
  *   description="Loader for commands and basic commands function"
  * )
  */
module.exports = class CommandLoader {

  static getCommands() {
    return commands;
  }

  static getCommandInfo(name) {
    for (var index in commands) {
      if (TOOLS.Array.inArray(commands[index].alias, name)) {
        return commands[index];
      }
    }
    return null;
  }

  static getCommand(name, args = null) {
    var info = CommandLoader.getCommandInfo(name);
    if (!info) return null;

    var struct = SYS.use(info.path);
    var command = struct.build.apply(struct, [{args: args, info: info}]);
    return {
      info: info,
      struct: struct,
      command: command,
    };
  }

  static execute(command, args = []) {
    var execution = {
      command: null,
      info: null,
      result: {},
      args: args,
      exe: null,
    };

    if (!ISDEF(command)) {
      execution.result.code = Command.FATAL;
      SYS.route('logger').error('No commands to execute found!');
      return execution;
    }
    var exe = command.split('.');
    execution.exe = exe;

    var data = CommandLoader.getCommand(exe[0], args);

    execution.info = data.info;
    execution.command = data.command;

    var applyArgs = TOOLS.args(args._, 1);

    try {
      var func = CommandLoader.getCallFunctionData(data, exe[1]);
      var code = func.apply(execution.command, applyArgs);

      execution.result = execution.command.getResult();
      if (code) {
        execution.result.code = code;
      }
    } catch (e) {
      CommandLoader.error(e);
      execution.result.code = CommandBase.FATAL;
      console.log(e);
    }

    return CommandLoader.evaluation(execution);
  }

  static getFunctionData(data, name = null) {
    return CommandLoader.getFunction(data.info.annotation, name);
  }

  static getFunction(annotation, name = null) {
    var methods = annotation.getMethods('Command');
    var found = [];

    for (var i in methods) {
      if (!name || methods[i].target.startsWith(name) || TOOLS.Array.startsWith(methods[i].alias, name)) {
        found.push(methods[i]);
      }
    }

    return found;
  }

  static getCallFunctionData(data, name = null) {
    return CommandLoader.getCallFunction(data.command, data.info.annotation, name);
  }

  static getCallFunction(command, annotation, name = null) {
    var found = CommandLoader.getFunction(annotation, name);

    if (found.length == 1) return command[found[0].target];
    return command.def;
  }

  static error(exception) {
    var Logger = SYS.route('logger');

    if (Logger === null) {
      SYS.error(exception);
    } else {
      Logger.error(exception.toString());
    }
  }

  static evaluation(execution) {
    if (execution.result.code === CommandBase.OK || execution.result.code === CommandBase.ERROR) {
      // OK or ERROR is handeled by command
    } else if (execution.result.code === undefined) {
      SYS.route('logger').error('No command found with name "%s"', execution.exe[0]);
    } else if (TOOLS.isInt(execution.result.code)) {
      SYS.route('logger').error('Command terminated unexpectedly with exit code "' + execution.result.code + '"');
    }

    return execution;
  }

}