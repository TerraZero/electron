'use strict';

var fs = require('fs');
var remote = require('electron').remote;

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

};