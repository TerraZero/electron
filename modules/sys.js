'use strict';

var fs = require('fs');
var remote = require('electron').remote;

module.exports = {

  vars: {},

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
    return sys.base + 'src/' + type + '/' + name;
  },

  read: function(type, name) {
    return fs.readFileSync(this.path(type, name));
  },

  use: function(name) {
    var clas = require(this.base + 'classes/' + name + '.class.js');

    if (clas.isStatic) return clas;

    if (clas.static) clas.static();

    clas.isStatic = true;
    return clas;
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