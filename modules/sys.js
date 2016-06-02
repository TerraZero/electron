'use strict';

const fs = require('fs');
const remote = require('electron').remote;

module.exports = {

  vars: {},
  paths: {},

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

    if (module.isInit) return module;

    if (module.init) module.init();

    module.isInit = true;
    return module;
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
    this.paths[name] = path;
  },

  className: function(name) {
    for (var field in this.paths) {
      name = name.replace(field, this.paths[field]);
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
    return this.vars[name];
  },

  set: function(name, value) {
    this.vars[name] = value;
  },

  secure: function() {
    var args = arguments;

    for (var i = 0; i < args.length; i += 2) {
      if (!(args[i] instanceof args[i + 1])) {
        throw new TypeError('The argument type did not match!');
      }
    }
  },

  abstract: function(subject, method) {
    throw new TypeError('The method "' + method + '" of class "' + subject.constructor.name + '" is not implement!');
  },

};