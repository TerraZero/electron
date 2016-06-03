'use strict';

const Module = require('./Module.class.js');

module.exports = class SysError {

  constructor(context) {
    this._context = context;
  }

  message(message, placeholders) {
    for (var placeholder in placeholders) {
      message = message.replace(':' + placeholder, '"' + placeholders[placeholder] + '"');
    }
    for (var placeholder in placeholders) {
      message = message.replace('!' + placeholder, placeholders[placeholder]);
    }
    return message;
  }

  error(message) {
    message = this._context.message || message;

    if (this._context.object) {
      if (this._context.object instanceof Module) {
        this._context.type = 'module';
      } else {
        this._context.type = 'class';
      }
      this._context.subject = this._context.object.constructor.name;
    }

    return this.message(message, this._context);
  }

  abstract() {
    throw new TypeError(this.error('The method :method of :type :subject is not implement and abstract!'));
  }

  checkTypes() {
    var args = arguments;

    for (var i = 0; i < args.length; i += 2) {
      if (!(args[i] instanceof args[i + 1])) {
        throw new TypeError(this.error('The argument type did not match in !type :subject by method :method!'));
      }
    }
  }

}