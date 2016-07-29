'use strict';

module.exports = class CommandBase {

  static build(args) {
    return new this(args);
  }

  static get OK() {
    return 0;
  }

  static get ERROR() {
    return 1;
  }

  static get FATAL() {
    return 2;
  }

  constructor(args) {
    this._valueargs = args;
    this._result = {
      outs: [],
      ins: [],
      code: CommandBase.OK,
    };
    this._outs = [];
  }

  def() {
    var suggestions = this._suggestion();
    var exe = this._args()[0].split('.');

    this.error('Command "' + exe[1] + '" not found in "' + this._name() + '" or multiply suggestions available');
    this.log('Try one of the following commands:');

    if (exe[1]) {
      suggestions = TOOLS.Array.filter(suggestions, exe[1] + '.*');
    }

    if (suggestions.length == 0) suggestions = this._suggestion();

    for (var i in suggestions) {
      this.log('  ' + i + ': ' + exe[0] + '.' + suggestions[i]);
    }
  }

  log() {
    CLI.log.apply(CLI, TOOLS.args(arguments));
  }

  out(item) {
    CLI.log(item);
    this._result.outs.push(item);
  }

  error(message) {
    CLI.error(message);
    this._result.code = CommandBase.ERROR;
  }

  _getResult() {
    return this._result;
  }

  _name() {
    return this.constructor.name;
  }

  _args() {
    return this._valueargs;
  }

  _suggestion(suggestions = []) {
    return suggestions;
  }

}