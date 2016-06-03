'use strict';

const Module = require('./../classes/sys/Module.class.js');
const SysError = require('./../classes/sys/SysError.class.js');

const fs = require('fs');
const remote = require('electron').remote;

module.exports = {

  _vars: {},
  _paths: {},

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

  context: function(subject, method = null, message = null) {
    var context = {
      subject: null,
      object: null,
      type: null,
      method: method,
      message: message,
    };

    if (subject === true) {
      return new SysError(method);
    }

    if (subject && subject.constructor && subject.constructor.name && typeof subject != 'string') {
      context.object = subject;
    } else if (subject) {
      context.subject = subject;
    }
    return new SysError(context);
  },

};