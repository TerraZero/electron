'use strict';

module.exports = class CommandBase {

  static build(args) {
    return new this(args);
  }

  static get ERROR() {
    return 1;
  }

  static get FATAL() {
    return 2;
  }

  constructor(args) {
    this._valueargs = args;
    this._outs = [];
  }

  def() {
    var suggestions = this._suggestion();
    var exe = this._args()[0].split('.');

    CLI.error('Command "' + exe[1] + '" not found in "' + this._name() + '" or multiply suggestions available');
    CLI.log('Try one of the following commands:');

    if (exe[1]) {
      suggestions = TOOLS.Array.filter(suggestions, exe[1] + '.*');
    }

    for (var i in suggestions) {
      CLI.log('  ' + i + ': ' + exe[0] + '.' + suggestions[i]);
    }
  }

  out(item) {
    CLI.log(item);
    this._outs.push(item);
  }

  _getOuts() {
    return this._outs;
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