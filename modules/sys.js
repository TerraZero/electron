'use strict';

const Module = require('./../classes/sys/Module.class.js');
const fs = require('fs');
const remote = require('electron').remote;

module.exports = {

  _vars: {},
  _paths: {},
  _context: {
    subject: null,
    method: null,
    message: null,
    object: null,
    type: null,
  },

  exists: function(path) {
    try {
      return fs.statSync(path);
    } catch (e) {
      return false;
    }
  },

  node: function(name) {
    return require(name);
  },

  module: function(name) {
    var module = require(this.base + 'modules/' + name + '.js');

    if (!module._instance) {
      module._instance = new module();
    }

    return module._instance;
  },

  src: function(type, name) {
    return require(this.path(type, name));
  },

  path: function(type, name) {
    return this.base + 'src/' + type + '/' + name;
  },

  read: function(type, name) {
    return fs.readFileSync(this.path(type, name));
  },

  register: function(name, path) {
    this._paths[name] = path;
  },

  className: function(name) {
    for (var field in this._paths) {
      name = name.replace(field, this._paths[field]);
    }
    return name;
  },

  use: function(name) {
    var subject = require(this.base + 'classes/' + this.className(name) + '.class.js');

    // start init function for static class
    if (!subject.isSubject && typeof subject.subject == 'function') {
      subject.subject();
    }
    subject.isSubject = true;

    return subject;
  },

  remote: function(name) {
    return remote.require(name);
  },

  exit: function() {
    this.remote('electron').app.quit();
  },

  get: function(name) {
    return this._vars[name];
  },

  set: function(name, value) {
    this._vars[name] = value;
  },

  msg: function(message, placeholders) {
    for (var placeholder in placeholders) {
      message = message.replace(':' + placeholder, '"' + placeholders[placeholder] + '"');
    }
    for (var placeholder in placeholders) {
      message = message.replace('!' + placeholder, placeholders[placeholder]);
    }
    return message;
  },

  errorMSG: function(message) {
    message = this._context.message || message;

    if (this._context.object) {
      if (this._context.object instanceof Module) {
        this._context.type = 'module';
      } else {
        this._context.type = 'class';
      }
      this._context.subject = this._context.object.constructor.name;
    }

    return this.msg(message, this._context);
  },

  context: function(subject, method, message) {
    this._context.subject = null;
    this._context.object = null;
    this._context.type = null;

    if (subject && subject.constructor && subject.constructor.name) {
      this._context.object = subject;
    } else if (subject) {
      this._context.subject = subject;
    }
    this._context.method = method || null;
    this._context.message = message || null;
    return this;
  },

  secure: function() {
    var args = arguments;

    for (var i = 0; i < args.length; i += 2) {
      if (!(args[i] instanceof args[i + 1])) {
        throw new TypeError(this.errorMSG('The argument type did not match in !type :subject by method :method!'));
      }
    }
  },

  abstract: function() {
    throw new TypeError(this.errorMSG('The method :method of :type :subject is not implement and abstract!'));
  },

};