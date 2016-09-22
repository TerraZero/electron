'use strict';

const Gettable = use('interface.gettable');

/**
  * @Base("Command")
  */
module.exports = class Command extends Gettable {

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
    super();
    this._args = args.args;
    this._info = args.info;

    this._result = {
      outs: [],
      ins: [],
      code: Command.OK,
    };
    this._outs = [];
  }

  def() {
    var exe = this.args()._[0].split('.');
    var annotations = new TOOLS.Annotation(this.path());
    var methods = annotations.getMethods('Command');
    var found = [];

    for (var i in methods) {
      if (!exe[1] || methods[i].target.startsWith(exe[1]) || TOOLS.Array.startsWith(methods[i].alias, exe[1])) {
        found.push(methods[i]);
      }
    }

    if (found.length == 0) {
      for (var i in methods) {
        found.push(methods[i]);
      }
    }

    this.error('Command "' + exe[1] + '" not found in "' + this.name() + '" or multiply suggestions available');

    this.log('Command "' + this.name() + '" (alias: [' + this.alias().join(', ') + '])');
    this.log('Try one of the following commands:');
    for (var i in found) {
      this.log('  ' + i + ': ' + exe[0] + '.' + found[i].target);
      if (found[i].alias.length) {
        this.log('       alias: [' + found[i].alias.join(', ') + ']');
      }
    }
  }

  log() {
    use('logger').log.apply(use('logger'), TOOLS.args(arguments));
  }

  out(item) {
    use('logger').log(item);
    this._result.outs.push(item);
  }

  warn(message) {
    use('logger').warn(message);
  }

  error(message) {
    use('logger').error(message);
    this._result.code = Command.ERROR;
  }

  success(message) {
    use('logger').success(message);
  }

  input(types, message, fallback = null) {
    return use('logger').input(types, message, fallback);
  }

  confirm(message) {
    return use('logger').confirm(message);
  }

  options(message, options) {
    return use('logger').options(message, options);
  }

  table(data) {
    return use('logger').table(data);
  }

  getResult() {
    return this._result;
  }

  name() {
    return this.constructor.name;
  }

  args() {
    return this._args;
  }

  arg(name, fallback = null) {
    return (this.args()[name] === undefined ? fallback : this.args()[name]);
  }

  path() {
    return this._info.path;
  }

  annotation() {
    return this._info.annotation;
  }

  alias() {
    return this._info.alias;
  }

}