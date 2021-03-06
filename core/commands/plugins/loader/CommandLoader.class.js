'use strict';

const CommandBase = use('base.command');

// load commands
const commands = (function registerCommands() {
  let plugins = SYS.plugins('Command');
  let result = [];

  for (let i in plugins) {
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
    for (let index in commands) {
      if (TOOLS.Array.inArray(commands[index].alias, name)) {
        return commands[index];
      }
    }
    return null;
  }

  static getCommand(name, args = null) {
    let info = CommandLoader.getCommandInfo(name);
    if (!info) return null;

    let struct = inc(info.path);
    let command = struct.build.apply(struct, [{args: args, info: info}]);
    return {
      info: info,
      struct: struct,
      command: command,
    };
  }

  static execute(command, args = []) {
    let execution = {
      command: null,
      info: null,
      result: {},
      args: args,
      exe: null,
    };

    if (command === undefined) {
      execution.result.code = Command.FATAL;
      use('logger').error('No commands to execute found!');
      return execution;
    }
    let exe = command.split('.');
    execution.exe = exe;

    let data = CommandLoader.getCommand(exe[0], args);

    execution.info = data.info;
    execution.command = data.command;

    let applyArgs = TOOLS.args(args._, 1);

    try {
      let func = CommandLoader.getCallFunctionData(data, exe[1]);
      let code = func.apply(execution.command, applyArgs);

      execution.result = execution.command.getResult();
      if (code) {
        execution.result.code = code;
      }
    } catch (e) {
      execution.result.code = CommandBase.FATAL;
      CommandLoader.error(e);
    }

    return CommandLoader.evaluation(execution);
  }

  static getFunctionData(data, name = null) {
    return CommandLoader.getFunction(data.info.annotation, name);
  }

  static getFunction(annotation, name = null) {
    let methods = annotation.getMethods('Command');
    let found = [];

    for (let i in methods) {
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
    let found = CommandLoader.getFunction(annotation, name);

    if (found.length == 1) return command[found[0].target];
    return command.def;
  }

  static error(exception) {
    throw err('CommandError', null, exception);
  }

  static evaluation(execution) {
    if (execution.result.code === CommandBase.OK || execution.result.code === CommandBase.ERROR) {
      // OK or ERROR is handeled by command
    } else if (execution.result.code === undefined) {
      use('logger').error('No command found with name "%s"', execution.exe[0]);
    } else if (TOOLS.isInt(execution.result.code)) {
      use('logger').error('Command terminated unexpectedly with exit code "' + execution.result.code + '"');
    }

    return execution;
  }

}